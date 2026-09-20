// client/src/pages/Checkout.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  Check,
  AlertCircle,
  Plus,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/orderService";
import { LocationContext } from "../context/LocationContext";
import { useUser } from "../context/UserContext";
import API from "../services/api";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { user } = useUser();
  const { location: navbarLocation } = useContext(LocationContext);

  // Multi-step state: 1 = Address, 2 = Payment, 3 = Review
  const [currentStep, setCurrentStep] = useState(1);

  // Address State
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [loadingAddress, setLoadingAddress] = useState(true);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });
  const [upiId, setUpiId] = useState("");
  const [paymentError, setPaymentError] = useState("");

  // Submitting & Modal State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Load Saved Database Addresses
  useEffect(() => {
    let isMounted = true;

    API.get("/location")
      .then((res) => {
        if (!isMounted) return;
        const list = res.data?.addresses || [];
        if (list.length > 0) {
          setAddresses(list);
          const defaultAddr = list.find((a) => a.isDefault) || list[0];
          setSelectedAddressId(defaultAddr._id || defaultAddr.id);
        } else if (navbarLocation) {
          const fallbackObj = {
            _id: "navbar-fallback",
            label: "Selected Location",
            formattedAddress: navbarLocation,
            street: navbarLocation,
            city: "Current Locality",
            name: user?.fullname || "Customer",
            details: navbarLocation,
            phone: user?.contact ? String(user.contact) : "9876543210",
          };
          setAddresses([fallbackObj]);
          setSelectedAddressId("navbar-fallback");
        }
      })
      .catch((err) => {
        console.warn("Could not load addresses, using fallback context.");
      })
      .finally(() => {
        if (isMounted) setLoadingAddress(false);
      });

    return () => {
      isMounted = false;
    };
  }, [navbarLocation, user]);

  // Price calculations
  const subtotal = cartItems.reduce((total, item) => {
    const product = item.product || item;
    const price = Number(product.price) || 0;
    const discount = Number(product.discount) || 0;
    const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;
    return total + finalPrice * (item.quantity || 1);
  }, 0);

  const deliveryFee = subtotal >= 500 || subtotal === 0 ? 0 : 30;
  const total = subtotal + deliveryFee;

  // PAYMENT VALIDATION
  const validatePayment = () => {
    setPaymentError("");

    if (paymentMethod === "cod") {
      return true;
    }

    if (paymentMethod === "upi") {
      const upiRegex = /^[\w.-]+@[\w.-]+$/;
      if (!upiId.trim() || !upiRegex.test(upiId.trim())) {
        setPaymentError(
          "Please enter a valid UPI ID (e.g. username@upi or number@paytm)"
        );
        return false;
      }
      return true;
    }

    if (paymentMethod === "card") {
      const cleanNumber = cardDetails.number.replace(/\s+/g, "");
      const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;

      if (!cardDetails.name.trim()) {
        setPaymentError("Please enter the cardholder name.");
        return false;
      }
      if (cleanNumber.length !== 16 || !/^\d+$/.test(cleanNumber)) {
        setPaymentError("Please enter a valid 16-digit card number.");
        return false;
      }
      if (!expiryRegex.test(cardDetails.expiry.trim())) {
        setPaymentError("Please enter a valid expiry date in MM/YY format.");
        return false;
      }
      if (
        cardDetails.cvv.trim().length !== 3 ||
        !/^\d+$/.test(cardDetails.cvv.trim())
      ) {
        setPaymentError("Please enter a valid 3-digit CVV.");
        return false;
      }
      return true;
    }

    return false;
  };

  const handleProceedToNextStep = () => {
    if (currentStep === 1) {
      if (!selectedAddressId && addresses.length > 0) {
        alert("Please select a delivery address to proceed.");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validatePayment()) {
        setCurrentStep(3);
      }
    }
  };

  const selectedAddrObj = addresses.find(
    (a) => (a._id || a.id) === selectedAddressId
  );

  // PLACE ORDER HANDLER (Constructs required deliveryAddress object)
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // 1. Format items for Mongoose Order Schema
      const formattedItems = cartItems.map((item) => {
        const prod = item.product || item;
        const rawId = prod._id || prod.id || item._id || item.id;
        const price = Number(prod.price) || 0;
        const discount = Number(prod.discount) || 0;
        const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;

        return {
          product: String(rawId),
          name: prod.name || "Food Item",
          image: prod.image || prod.images?.[0] || "https://via.placeholder.com/100",
          price: Number(finalPrice.toFixed(2)),
          quantity: Number(item.quantity) || 1,
        };
      });

      // 2. Construct nested deliveryAddress object satisfying required fields 'name' & 'details'
      const deliveryAddressObj = {
        name: user?.fullname || selectedAddrObj?.label || "Customer",
        details: selectedAddrObj?.formattedAddress || navbarLocation || "Delivery Location",
        phone: user?.contact ? String(user.contact) : "9876543210",
        label: selectedAddrObj?.label || "Home",
      };

      // 3. Payload
      const payload = {
        items: formattedItems,
        deliveryAddress: deliveryAddressObj,
        paymentMethod: paymentMethod.toLowerCase(),
        subtotal: Number(subtotal.toFixed(2)),
        deliveryFee: Number(deliveryFee.toFixed(2)),
        totalAmount: Number(total.toFixed(2)),
      };

      const res = await createOrder(payload);

      if (res.success || res.order || res.data || res.status === 200 || res.status === 201) {
        await clearCart();
        setOrderPlaced(true);
      } else {
        throw new Error(res.message || "Order rejected by server.");
      }
    } catch (err) {
      console.error("ORDER CREATION FAILURE:", err);
      const serverErr =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Unable to place order. Please try again.";
      setErrorMessage(serverErr);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-12 py-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* PROGRESS BAR */}
        <div className="flex items-center justify-center gap-2 sm:gap-6 mb-10 max-w-xl mx-auto">
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-all ${
                currentStep >= 1
                  ? "bg-[#ff6840] text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {currentStep > 1 ? <Check size={16} /> : <MapPin size={16} />}
            </div>
            <span
              className={`text-xs sm:text-sm font-bold ${
                currentStep >= 1 ? "text-[#ff6840]" : "text-gray-400"
              }`}
            >
              Address
            </span>
          </div>

          <div
            className={`h-1 w-10 sm:w-16 rounded-full transition-all ${
              currentStep >= 2 ? "bg-[#ff6840]" : "bg-gray-200"
            }`}
          />

          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-all ${
                currentStep >= 2
                  ? "bg-[#ff6840] text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {currentStep > 2 ? <Check size={16} /> : <CreditCard size={16} />}
            </div>
            <span
              className={`text-xs sm:text-sm font-bold ${
                currentStep >= 2 ? "text-[#ff6840]" : "text-gray-400"
              }`}
            >
              Payment
            </span>
          </div>

          <div
            className={`h-1 w-10 sm:w-16 rounded-full transition-all ${
              currentStep === 3 ? "bg-[#ff6840]" : "bg-gray-200"
            }`}
          />

          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-all ${
                currentStep === 3
                  ? "bg-[#ff6840] text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              3
            </div>
            <span
              className={`text-xs sm:text-sm font-bold ${
                currentStep === 3 ? "text-[#ff6840]" : "text-gray-400"
              }`}
            >
              Review
            </span>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-2 space-y-6">

            {/* STEP 1: ADDRESS */}
            {currentStep === 1 && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-in fade-in duration-200">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-lg font-bold text-gray-900">
                    Select Delivery Address
                  </h2>
                  <button
                    onClick={() => navigate("/profile")}
                    className="flex items-center gap-1 text-xs font-bold text-[#ff6840] hover:underline cursor-pointer"
                  >
                    <Plus size={14} /> Add New Address
                  </button>
                </div>

                {loadingAddress ? (
                  <p className="text-xs text-gray-400 py-4 text-center">
                    Loading saved addresses...
                  </p>
                ) : addresses.length > 0 ? (
                  <div className="space-y-4">
                    {addresses.map((addr) => {
                      const addrId = addr._id || addr.id;
                      const isSelected = selectedAddressId === addrId;
                      return (
                        <div
                          key={addrId}
                          onClick={() => setSelectedAddressId(addrId)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                            isSelected
                              ? "border-[#ff6840] bg-orange-50/40 shadow-sm"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="address"
                            checked={isSelected}
                            onChange={() => setSelectedAddressId(addrId)}
                            className="mt-1 accent-[#ff6840] w-4 h-4 cursor-pointer"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <h3 className="font-bold text-gray-900 text-sm">
                                {addr.label || "Address"}
                              </h3>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              {addr.formattedAddress}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 text-xs font-medium text-gray-700">
                    Delivering to: <span className="font-bold">{navbarLocation || "Selected Location"}</span>
                  </div>
                )}

                <button
                  onClick={handleProceedToNextStep}
                  className="w-full mt-6 bg-[#ff6840] hover:bg-[#e05530] text-white py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Proceed to Payment →
                </button>
              </div>
            )}

            {/* STEP 2: PAYMENT */}
            {currentStep === 2 && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-in fade-in duration-200">
                <button
                  onClick={() => {
                    setPaymentError("");
                    setCurrentStep(1);
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#ff6840] mb-4 transition-colors"
                >
                  <ArrowLeft size={14} /> Back to Address
                </button>

                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Select Payment Method
                </h2>

                <div className="space-y-3 mb-6">
                  <label
                    className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "border-[#ff6840] bg-orange-50/40"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => {
                        setPaymentMethod("cod");
                        setPaymentError("");
                      }}
                      className="accent-[#ff6840] w-4 h-4"
                    />
                    <div>
                      <span className="text-sm font-bold text-gray-800 block">
                        Cash on Delivery
                      </span>
                      <span className="text-xs text-gray-500">
                        Pay cash or UPI upon food arrival
                      </span>
                    </div>
                  </label>

                  <div
                    className={`p-4 rounded-2xl border transition-all ${
                      paymentMethod === "upi"
                        ? "border-[#ff6840] bg-orange-50/40"
                        : "border-gray-200"
                    }`}
                  >
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="upi"
                        checked={paymentMethod === "upi"}
                        onChange={() => {
                          setPaymentMethod("upi");
                          setPaymentError("");
                        }}
                        className="accent-[#ff6840] w-4 h-4"
                      />
                      <span className="text-sm font-bold text-gray-800">
                        UPI / Google Pay / PhonePe / Paytm
                      </span>
                    </label>

                    {paymentMethod === "upi" && (
                      <div className="mt-3 pl-7">
                        <input
                          type="text"
                          placeholder="Enter UPI ID (e.g. username@upi)"
                          value={upiId}
                          onChange={(e) => {
                            setUpiId(e.target.value);
                            setPaymentError("");
                          }}
                          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#ff6840] bg-white"
                        />
                      </div>
                    )}
                  </div>

                  <div
                    className={`p-4 rounded-2xl border transition-all ${
                      paymentMethod === "card"
                        ? "border-[#ff6840] bg-orange-50/40"
                        : "border-gray-200"
                    }`}
                  >
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={() => {
                          setPaymentMethod("card");
                          setPaymentError("");
                        }}
                        className="accent-[#ff6840] w-4 h-4"
                      />
                      <span className="text-sm font-bold text-gray-800">
                        Credit / Debit Card
                      </span>
                    </label>

                    {paymentMethod === "card" && (
                      <div className="mt-4 pl-7 space-y-3">
                        <input
                          type="text"
                          placeholder="Cardholder Name"
                          value={cardDetails.name}
                          onChange={(e) => {
                            setCardDetails({ ...cardDetails, name: e.target.value });
                            setPaymentError("");
                          }}
                          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#ff6840] bg-white"
                        />
                        <input
                          type="text"
                          placeholder="16-Digit Card Number"
                          maxLength={16}
                          value={cardDetails.number}
                          onChange={(e) => {
                            setCardDetails({ ...cardDetails, number: e.target.value });
                            setPaymentError("");
                          }}
                          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#ff6840] bg-white"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="MM/YY"
                            maxLength={5}
                            value={cardDetails.expiry}
                            onChange={(e) => {
                              setCardDetails({ ...cardDetails, expiry: e.target.value });
                              setPaymentError("");
                            }}
                            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#ff6840] bg-white"
                          />
                          <input
                            type="password"
                            placeholder="CVV"
                            maxLength={3}
                            value={cardDetails.cvv}
                            onChange={(e) => {
                              setCardDetails({ ...cardDetails, cvv: e.target.value });
                              setPaymentError("");
                            }}
                            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#ff6840] bg-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {paymentError && (
                  <div className="flex items-center gap-2 p-3.5 mb-4 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-100">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{paymentError}</span>
                  </div>
                )}

                <button
                  onClick={handleProceedToNextStep}
                  className="w-full bg-[#ff6840] hover:bg-[#e05530] text-white py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Proceed to Review →
                </button>
              </div>
            )}

            {/* STEP 3: REVIEW & SUBMIT */}
            {currentStep === 3 && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-in fade-in duration-200 space-y-6">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#ff6840] transition-colors"
                >
                  <ArrowLeft size={14} /> Back to Payment
                </button>

                <h2 className="text-lg font-bold text-gray-900">
                  Review Your Order
                </h2>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Deliver To
                    </span>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="text-xs font-bold text-[#ff6840]"
                    >
                      Change
                    </button>
                  </div>
                  <p className="text-xs font-bold text-gray-900">
                    {user?.fullname || selectedAddrObj?.label || "Selected Location"}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {selectedAddrObj?.formattedAddress || navbarLocation || "Default Location"}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Payment Mode
                    </span>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="text-xs font-bold text-[#ff6840]"
                    >
                      Change
                    </button>
                  </div>
                  <p className="text-sm font-bold text-gray-900 capitalize">
                    {paymentMethod === "cod" && "Cash on Delivery"}
                    {paymentMethod === "upi" && `UPI (${upiId || "Standard"})`}
                    {paymentMethod === "card" &&
                      `Card ending in ${cardDetails.number.slice(-4) || "****"}`}
                  </p>
                </div>

                {errorMessage && (
                  <div className="flex items-center gap-2 p-3.5 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-100">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100 font-semibold">
                  <ShieldCheck size={16} /> Safe & Encrypted Checkout Powered by SnackDrop
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 scrollbar-thin mb-4">
                {cartItems.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4">
                    No items in cart
                  </p>
                ) : (
                  cartItems.map((item, idx) => {
                    const product = item.product || item;
                    const price = Number(product.price) || 0;
                    const image =
                      product.image ||
                      product.images?.[0] ||
                      "https://via.placeholder.com/100";

                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={image}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                          />
                          <div className="truncate">
                            <p className="font-bold text-gray-800 truncate">
                              {product.name}
                            </p>
                            <p className="text-gray-400 text-[10px]">
                              Qty: {item.quantity || 1}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-gray-900 shrink-0">
                          ₹{(price * (item.quantity || 1)).toFixed(0)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-800">
                    ₹{subtotal.toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-emerald-600">
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 my-4" />

              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-bold text-gray-900">Total</span>
                <span className="text-xl font-extrabold text-[#ff6840]">
                  ₹{total.toFixed(0)}
                </span>
              </div>

              {currentStep < 3 ? (
                <button
                  onClick={handleProceedToNextStep}
                  disabled={cartItems.length === 0}
                  className="w-full bg-[#ff6840] hover:bg-[#e05530] text-white py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  Continue to {currentStep === 1 ? "Payment" : "Review"} →
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={cartItems.length === 0 || isSubmitting}
                  className="w-full bg-[#ff6840] hover:bg-[#e05530] text-white py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Placing Order..." : "Place Order"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {orderPlaced && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">Order Placed!</h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Thank you for ordering with SnackDrop. Your food will be delivered shortly!
            </p>
            <button
              onClick={() => navigate("/orders")}
              className="mt-6 w-full py-3 bg-[#ff6840] text-white font-bold rounded-2xl text-xs hover:bg-[#e05530] transition cursor-pointer"
            >
              View My Orders →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}