// src/pages/Cart.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import gif from "../assets/shopping-cart.gif";

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, loading, addToCart, removeFromCart, clearCart } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading cart...</p>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="text-6xl mb-5">
          <img className="h-25" src={gif} alt="Shopping Cart" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Your Cart is Empty</h1>
        <p className="text-gray-500 mt-2 text-center">
          Looks like you haven't added anything to your cart yet.
        </p>
        <button
          className="mt-6 bg-[#ff6547] text-white px-7 py-3 rounded-full font-semibold hover:bg-[#f5573a] transition"
          onClick={() => navigate("/explore")}
        >
          Explore Products
        </button>
      </div>
    );
  }

  const subtotal = cartItems.reduce((total, item) => {
    const product = item.product || item;
    const price = Number(product.price) || 0;
    const discount = Number(product.discount) || 0;
    const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;
    return total + finalPrice * (item.quantity || 1);
  }, 0);

  const deliveryFee = subtotal >= 500 ? 0 : 40;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-[#fffaf8] px-4 sm:px-6 lg:px-20 py-8 pb-28 lg:pb-12 font-sans">
      <div className="max-w-7xl mx-auto mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Your Cart</h1>
          <p className="text-gray-500 mt-1 text-xs sm:text-sm">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {/* PILL CLEAR CART BUTTON */}
        <button
          onClick={clearCart}
          className="self-start sm:self-auto text-xs sm:text-sm text-red-500 hover:text-red-600 font-medium border border-red-100 px-4 py-2 rounded-full hover:bg-red-50 transition active:scale-95"
        >
          Clear Cart
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item, index) => {
            const product = item.product || item;
            const productId = String(product._id || product.id || index);
            const price = Number(product.price) || 0;
            const discount = Number(product.discount) || 0;
            const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;
            const image = product.image || product.images?.[0] || "https://via.placeholder.com/150";

            return (
              <div
                key={productId}
                className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row gap-4 sm:gap-5 border border-gray-100"
              >
                <img
                  src={image}
                  alt={product.name}
                  className="w-full sm:w-28 h-28 object-cover rounded-xl bg-gray-100 shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between gap-4">
                      <div>
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900">{product.name}</h2>
                        <p className="text-xs text-gray-500 mt-0.5 capitalize">{product.category || "General"}</p>
                      </div>

                      <button
                        onClick={() => removeFromCart(productId)}
                        className="text-gray-400 hover:text-red-500 text-xl font-bold"
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-base sm:text-lg font-bold text-[#ff6547]">
                        ₹{finalPrice.toFixed(2)}
                      </span>

                      {discount > 0 && (
                        <>
                          <span className="text-xs sm:text-sm text-gray-400 line-through">
                            ₹{price.toFixed(2)}
                          </span>
                          <span className="text-[10px] sm:text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-semibold">
                            {discount}% OFF
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                      <button
                        onClick={() => addToCart(product, -1)}
                        disabled={(item.quantity || 1) <= 1}
                        className="w-8 h-8 text-base hover:bg-gray-100 disabled:text-gray-300 font-bold"
                      >
                        −
                      </button>

                      <span className="w-8 text-center text-xs sm:text-sm font-bold text-gray-900">
                        {item.quantity || 1}
                      </span>

                      <button
                        onClick={() => addToCart(product, 1)}
                        className="w-8 h-8 text-base hover:bg-gray-100 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <p className="font-extrabold text-sm sm:text-base text-gray-900">
                      ₹{(finalPrice * (item.quantity || 1)).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 lg:sticky lg:top-24">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">Order Summary</h2>

            <div className="space-y-3.5 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Delivery Fee</span>
                <span className="font-medium text-emerald-600">
                  {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-100 my-4" />

            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-gray-900">Total</span>
              <span className="text-xl sm:text-2xl font-bold text-[#ff6547]">
                ₹{total.toFixed(2)}
              </span>
            </div>

            <button
              className="w-full mt-6 bg-[#ff6547] hover:bg-[#f5573a] text-white py-3.5 rounded-full font-semibold transition active:scale-95 shadow-md text-sm"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}