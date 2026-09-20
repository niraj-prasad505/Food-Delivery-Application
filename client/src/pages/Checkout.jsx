import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, CreditCard, CheckCircle2, ShieldCheck, ArrowLeft, Check } from "lucide-react";
import { useCart } from "../context/CartContext";
import { createOrder, createRazorpayOrder, verifyPayment } from "../services/orderService";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState("home");
  const [paymentMethod, setPaymentMethod] = useState("online"); // 'online' or 'cod'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const addresses = [
    {
      id: "home",
      label: "Home",
      name: "Akshit Singh",
      details: "123 College Road, Panagarh, West Bengal - 713148",
      phone: "9876543210",
    },
    {
      id: "work",
      label: "Work",
      name: "Durgapur Institute of Technology",
      details: "Durgapur Institute of Technology, Durgapur - 713006",
      phone: "9876543210",
    },
  ];

  const subtotal = cartItems.reduce((total, item) => {
    const product = item.product || item;
    const price = Number(product.price) || 0;
    const discount = Number(product.discount) || 0;
    const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;
    return total + finalPrice * (item.quantity || 1);
  }, 0);

  const deliveryFee = subtotal >= 500 || subtotal === 0 ? 0 : 30;
  const total = subtotal + deliveryFee;
  const selectedAddrObj = addresses.find((a) => a.id === selectedAddress);

  const formatCartItems = () =>
    cartItems.map((item) => {
      const product = item.product || item;
      const price = Number(product.price) || 0;
      const discount = Number(product.discount) || 0;
      const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;

      return {
        product: product._id || product.id,
        name: product.name,
        image: product.image || product.images?.[0] || "https://via.placeholder.com/100",
        price: finalPrice,
        quantity: item.quantity || 1,
      };
    });

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0 || isSubmitting) return;
    setIsSubmitting(true);

    const formattedItems = formatCartItems();

    try {
      // 1. CASH ON DELIVERY FLOW
      if (paymentMethod === "cod") {
        const payload = {
          items: formattedItems,
          deliveryAddress: selectedAddrObj,
          paymentMethod: "cod",
          subtotal,
          deliveryFee,
          totalAmount: total,
        };

        const res = await createOrder(payload);
        if (res.success) {
          await clearCart();
          setOrderPlaced(true);
        }
        setIsSubmitting(false);
        return;
      }

      // 2. RAZORPAY ONLINE PAYMENT FLOW
      const razorpayOrderData = await createRazorpayOrder(total);

      if (!razorpayOrderData.success) {
        alert("Failed to initialize payment gateway");
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
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              items: formattedItems,
              deliveryAddress: selectedAddrObj,
              subtotal,
              deliveryFee,
              totalAmount: total,
            };

            const verifyRes = await verifyPayment(verificationPayload);

            if (verifyRes.success) {
              await clearCart();
              setOrderPlaced(true);
            } else {
              alert("Payment verification failed!");
            }
          } catch (err) {
            alert(err.response?.data?.message || "Order verification error");
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: selectedAddrObj?.name,
          contact: selectedAddrObj?.phone,
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

      const paymentWindow = new window.Razorpay(options);
      paymentWindow.open();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong. Try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-12 py-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Progress Bar */}
        <div className="flex items-center justify-center gap-2 sm:gap-6 mb-10 max-w-xl mx-auto">
          <div className="flex items-center gap-2">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-all ${currentStep >= 1 ? "bg-[#ff6840] text-white" : "bg-gray-200 text-gray-500"}`}>
              {currentStep > 1 ? <Check size={16} /> : <MapPin size={16} />}
            </div>
            <span className={`text-xs sm:text-sm font-bold ${currentStep >= 1 ? "text-[#ff6840]" : "text-gray-400"}`}>Address</span>
          </div>

          <div className={`h-1 w-10 sm:w-16 rounded-full transition-all ${currentStep >= 2 ? "bg-[#ff6840]" : "bg-gray-200"}`} />

          <div className="flex items-center gap-2">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-all ${currentStep >= 2 ? "bg-[#ff6840] text-white" : "bg-gray-200 text-gray-500"}`}>
              {currentStep > 2 ? <Check size={16} /> : <CreditCard size={16} />}
            </div>
            <span className={`text-xs sm:text-sm font-bold ${currentStep >= 2 ? "text-[#ff6840]" : "text-gray-400"}`}>Payment</span>
          </div>

          <div className={`h-1 w-10 sm:w-16 rounded-full transition-all ${currentStep === 3 ? "bg-[#ff6840]" : "bg-gray-200"}`} />

          <div className="flex items-center gap-2">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-all ${currentStep === 3 ? "bg-[#ff6840] text-white" : "bg-gray-200 text-gray-500"}`}>
              3
            </div>
            <span className={`text-xs sm:text-sm font-bold ${currentStep === 3 ? "text-[#ff6840]" : "text-gray-400"}`}>Review</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Address */}
            {currentStep === 1 && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-lg font-bold text-gray-900">Select Delivery Address</h2>
                  <button onClick={() => navigate("/address")} className="text-xs font-bold text-[#ff6840] hover:underline">
                    + Add New Address
                  </button>
                </div>

                <div className="space-y-4">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddress === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddress(addr.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                          isSelected ? "border-[#ff6840] bg-orange-50/40 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={isSelected}
                          onChange={() => setSelectedAddress(addr.id)}
                          className="mt-1 accent-[#ff6840] w-4 h-4 cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <h3 className="font-bold text-gray-900 text-sm">{addr.label}</h3>
                          </div>
                          <p className="text-xs font-medium text-gray-700 mt-1">{addr.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{addr.details}</p>
                          <p className="text-xs text-gray-500 mt-1">{addr.phone}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentStep(2)}
                  className="w-full mt-6 bg-[#ff6840] hover:bg-[#e05530] text-white py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Proceed to Payment →
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#ff6840] mb-4"
                >
                  <ArrowLeft size={14} /> Back to Address
                </button>

                <h2 className="text-lg font-bold text-gray-900 mb-4">Select Payment Method</h2>

                <div className="space-y-3 mb-6">
                  {/* Razorpay Online */}
                  <label
                    className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === "online" ? "border-[#ff6840] bg-orange-50/40" : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={() => setPaymentMethod("online")}
                      className="accent-[#ff6840] w-4 h-4"
                    />
                    <div>
                      <span className="text-sm font-bold text-gray-800 block">
                        Pay Online (Razorpay)
                      </span>
                      <span className="text-xs text-gray-500">
                        Cards, UPI (GPay, PhonePe, Paytm), NetBanking & Wallets
                      </span>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === "cod" ? "border-[#ff6840] bg-orange-50/40" : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="accent-[#ff6840] w-4 h-4"
                    />
                    <div>
                      <span className="text-sm font-bold text-gray-800 block">Cash on Delivery</span>
                      <span className="text-xs text-gray-500">Pay with cash upon delivery</span>
                    </div>
                  </label>
                </div>

                <button
                  onClick={() => setCurrentStep(3)}
                  className="w-full bg-[#ff6840] hover:bg-[#e05530] text-white py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Proceed to Review →
                </button>
              </div>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#ff6840]"
                >
                  <ArrowLeft size={14} /> Back to Payment
                </button>

                <h2 className="text-lg font-bold text-gray-900">Review Your Order</h2>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Deliver To</span>
                    <button onClick={() => setCurrentStep(1)} className="text-xs font-bold text-[#ff6840]">
                      Change
                    </button>
                  </div>
                  <p className="text-sm font-bold text-gray-900">{selectedAddrObj?.name}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{selectedAddrObj?.details}</p>
                  <p className="text-xs text-gray-600 mt-1">{selectedAddrObj?.phone}</p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Mode</span>
                    <button onClick={() => setCurrentStep(2)} className="text-xs font-bold text-[#ff6840]">
                      Change
                    </button>
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    {paymentMethod === "online" ? "Razorpay Online (UPI, Cards, Netbanking)" : "Cash on Delivery"}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100 font-semibold">
                  <ShieldCheck size={16} /> 100% Secure & Encrypted Checkout
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 scrollbar-thin mb-4">
                {cartItems.map((item, idx) => {
                  const product = item.product || item;
                  const price = Number(product.price) || 0;
                  const image = product.image || product.images?.[0] || "https://via.placeholder.com/100";

                  return (
                    <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img src={image} alt={product.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
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
                })}
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
                  onClick={() => setCurrentStep((prev) => prev + 1)}
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
                  {isSubmitting ? "Processing..." : paymentMethod === "online" ? "Pay with Razorpay" : "Place COD Order"}
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