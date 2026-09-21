// src/pages/Checkout.jsx
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
  Loader2,
  Wallet,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { LocationContext } from "../context/LocationContext";
import API from "../services/api";
import {
  createOrder,
  createRazorpayOrder,
  verifyPayment,
} from "../services/orderService";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { user } = useUser();
  const { location: navbarLocation } = useContext(LocationContext) || {};

  const [currentStep, setCurrentStep] = useState(1);

  // Address State
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [loadingAddress, setLoadingAddress] = useState(true);

  // Payment State ('online' for Razorpay or 'cod')
  const [paymentMethod, setPaymentMethod] = useState("online");

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
      .catch(() => {
        console.warn("Could not load addresses, using fallback context.");
        if (navbarLocation) {
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
      .finally(() => {
        if (isMounted) setLoadingAddress(false);
      });

    return () => {
      isMounted = false;
    };
  }, [navbarLocation, user]);

  const subtotal = cartItems.reduce((total, item) => {
    const product = item.product || item;
    const price = Number(product.price) || 0;
    const discount = Number(product.discount) || 0;
    const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;
    return total + finalPrice * (item.quantity || 1);
  }, 0);

  const deliveryFee = subtotal >= 500 || subtotal === 0 ? 0 : 30;
  const total = subtotal + deliveryFee;

  // Active address object
  const selectedAddrObj = addresses.find(
    (a) => (a._id || a.id) === selectedAddressId
  );

  // Normalize delivery address for backend Order schema
  const formattedDeliveryAddress = {
    label: selectedAddrObj?.label || "Home",
    name: selectedAddrObj?.name || user?.fullname || "Customer",
    details:
      selectedAddrObj?.details ||
      selectedAddrObj?.formattedAddress ||
      selectedAddrObj?.street ||
      "Delivery Address",
    phone: selectedAddrObj?.phone || (user?.contact ? String(user.contact) : "9876543210"),
  };

  // Format cart items and maintain shop linkage
  const formatCartItems = () =>
    cartItems.map((item) => {
      const product = item.product || item;
      const price = Number(product.price) || 0;
      const discount = Number(product.discount) || 0;
      const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;
      const itemShopId =
        product.shop?._id || product.shop || item.shop?._id || item.shop || null;

      return {
        product: product._id || product.id,
        name: product.name,
        image: product.image || product.images?.[0] || "https://via.placeholder.com/100",
        price: finalPrice,
        quantity: item.quantity || 1,
        shop: itemShopId,
      };
    });

  // Step advancement handler
  const handleProceedToNextStep = () => {
    if (currentStep === 1) {
      if (!selectedAddressId) {
        setErrorMessage("Please select or add a delivery address.");
        return;
      }
      setErrorMessage("");
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  // ORDER SUBMISSION HANDLER
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");

    const formattedItems = formatCartItems();
    const firstProduct = cartItems[0]?.product || cartItems[0];
    const orderShopId =
      firstProduct?.shop?._id ||
      firstProduct?.shop ||
      cartItems[0]?.shop?._id ||
      cartItems[0]?.shop ||
      null;

    try {
      // 1. CASH ON DELIVERY (COD) FLOW
      if (paymentMethod === "cod") {
        const payload = {
          shop: orderShopId,
          items: formattedItems,
          deliveryAddress: formattedDeliveryAddress,
          paymentMethod: "cod",
          subtotal,
          deliveryFee,
          totalAmount: total,
        };

        const res = await createOrder(payload);
        if (res.success || res.status === 200 || res.status === 201) {
          await clearCart();
          setOrderPlaced(true);
        } else {
          setErrorMessage(res.message || "Failed to place COD order.");
        }
        setIsSubmitting(false);
        return;
      }

      // 2. RAZORPAY ONLINE FLOW
      const razorpayOrderData = await createRazorpayOrder(total);

      if (!razorpayOrderData.success) {
        setErrorMessage("Unable to initialize Razorpay payment. Please try again.");
        setIsSubmitting(false);
        return;
      }

      const options = {
        key: razorpayOrderData.key,
        amount: razorpayOrderData.order.amount,
        currency: razorpayOrderData.order.currency,
        name: "SnackDrop",
        description: "Food Delivery Order",
        order_id: razorpayOrderData.order.id,
        handler: async function (response) {
          try {
            const verificationPayload = {
              shop: orderShopId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              items: formattedItems,
              deliveryAddress: formattedDeliveryAddress,
              subtotal,
              deliveryFee,
              totalAmount: total,
            };

            const verifyRes = await verifyPayment(verificationPayload);

            if (verifyRes.success) {
              await clearCart();
              setOrderPlaced(true);
            } else {
              setErrorMessage("Payment verification failed! Please contact support.");
            }
          } catch (err) {
            setErrorMessage(err.response?.data?.message || "Order verification error");
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: formattedDeliveryAddress.name,
          contact: formattedDeliveryAddress.phone,
          email: user?.email || "",
        },
        theme: {
          color: "#ff6840",
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          },
        },
      };

      if (!window.Razorpay) {
        setErrorMessage("Razorpay SDK failed to load. Please check your internet connection.");
        setIsSubmitting(false);
        return;
      }

      const paymentWindow = new window.Razorpay(options);
      paymentWindow.open();
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Failed to place order. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-12 py-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* DYNAMIC PROGRESS BAR */}
        <div className="flex items-center justify-center gap-2 sm:gap-6 mb-10 max-w-xl mx-auto">
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-all ${
                currentStep >= 1 ? "bg-[#ff6840] text-white" : "bg-gray-200 text-gray-500"
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
                currentStep >= 2 ? "bg-[#ff6840] text-white" : "bg-gray-200 text-gray-500"
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
                currentStep === 3 ? "bg-[#ff6840] text-white" : "bg-gray-200 text-gray-500"
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

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT COLUMN: STEP VIEWS */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Address */}
            {currentStep === 1 && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-lg font-bold text-gray-900">Select Delivery Address</h2>
                  <button
                    onClick={() => navigate("/address")}
                    className="text-xs font-bold text-[#ff6840] hover:underline cursor-pointer"
                  >
                    + Add New Address
                  </button>
                </div>

                {loadingAddress ? (
                  <div className="flex items-center justify-center py-8 text-gray-400 gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-[#ff6840]" />
                    <span className="text-xs">Loading addresses...</span>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-gray-200 rounded-2xl">
                    <p className="text-xs text-gray-500 mb-2">No saved addresses found.</p>
                    <button
                      onClick={() => navigate("/address")}
                      className="text-xs font-bold text-[#ff6840] hover:underline cursor-pointer"
                    >
                      Add a delivery address to continue
                    </button>
                  </div>
                ) : (
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
                                {addr.label || "Delivery Location"}
                              </h3>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate("/address");
                                }}
                                className="text-xs font-semibold text-[#ff6840] hover:underline cursor-pointer"
                              >
                                Edit
                              </button>
                            </div>
                            <p className="text-xs font-medium text-gray-700 mt-1">
                              {addr.name || user?.fullname}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {addr.details || addr.formattedAddress || addr.street}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{addr.phone}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {errorMessage && (
                  <div className="flex items-center gap-2 p-3 mt-4 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-100">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  onClick={handleProceedToNextStep}
                  disabled={addresses.length === 0}
                  className="w-full mt-6 bg-[#ff6840] hover:bg-[#e05530] text-white py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  Proceed to Payment →
                </button>
              </div>
            )}

            {/* STEP 2: PAYMENT METHOD SELECTION */}
            {currentStep === 2 && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#ff6840] mb-4 cursor-pointer"
                >
                  <ArrowLeft size={14} /> Back to Address
                </button>

                <h2 className="text-lg font-bold text-gray-900 mb-4">Select Payment Method</h2>

                <div className="space-y-3 mb-6">
                  {/* Razorpay Online */}
                  <label
                    className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === "online"
                        ? "border-[#ff6840] bg-orange-50/40 shadow-xs"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={() => setPaymentMethod("online")}
                      className="accent-[#ff6840] w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <span className="text-sm font-bold text-gray-800 block">
                        Pay Online (Razorpay)
                      </span>
                      <span className="text-xs text-gray-500">
                        Cards, UPI (Google Pay, PhonePe, Paytm), NetBanking & Wallets
                      </span>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "border-[#ff6840] bg-orange-50/40 shadow-xs"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="accent-[#ff6840] w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <span className="text-sm font-bold text-gray-800 block">
                        Cash on Delivery
                      </span>
                      <span className="text-xs text-gray-500">Pay with cash upon delivery</span>
                    </div>
                  </label>
                </div>

                <button
                  onClick={handleProceedToNextStep}
                  className="w-full bg-[#ff6840] hover:bg-[#e05530] text-white py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Proceed to Review →
                </button>
              </div>
            )}

            {/* STEP 3: REVIEW & CONFIRM */}
            {currentStep === 3 && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#ff6840] cursor-pointer"
                >
                  <ArrowLeft size={14} /> Back to Payment
                </button>

                <h2 className="text-lg font-bold text-gray-900">Review Your Order</h2>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Deliver To
                    </span>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="text-xs font-bold text-[#ff6840] cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    {formattedDeliveryAddress.name}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {formattedDeliveryAddress.details}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formattedDeliveryAddress.phone}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Payment Mode
                    </span>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="text-xs font-bold text-[#ff6840] cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    {paymentMethod === "online"
                      ? "Razorpay Online (UPI, Cards, NetBanking)"
                      : "Cash on Delivery"}
                  </p>
                </div>

                {errorMessage && (
                  <div className="flex items-center gap-2 p-3.5 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-100">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100 font-semibold">
                  <ShieldCheck size={16} /> 100% Secure & Encrypted Checkout
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 scrollbar-thin mb-4">
                {cartItems.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4">No items in cart</p>
                ) : (
                  cartItems.map((item, idx) => {
                    const product = item.product || item;
                    const price = Number(product.price) || 0;
                    const image =
                      product.image || product.images?.[0] || "https://via.placeholder.com/100";

                    return (
                      <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={image}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                          />
                          <div className="truncate">
                            <p className="font-bold text-gray-800 truncate">{product.name}</p>
                            <p className="text-gray-400 text-[10px]">Qty: {item.quantity || 1}</p>
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
                  <span className="font-semibold text-gray-800">₹{subtotal.toFixed(0)}</span>
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
                <span className="text-xl font-extrabold text-[#ff6840]">₹{total.toFixed(0)}</span>
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
                  {isSubmitting
                    ? "Processing..."
                    : paymentMethod === "online"
                    ? "Pay with Razorpay"
                    : "Place COD Order"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {orderPlaced && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">Order Placed!</h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Your order has been placed successfully. Track your food in real-time.
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