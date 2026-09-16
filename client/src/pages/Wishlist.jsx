// src/pages/Wishlist.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import gif from "../assets/wishlist.gif";

export default function Wishlist() {
  const navigate = useNavigate();
  const { wishlistItems, loading, toggleWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading wishlist...</p>
      </div>
    );
  }

  // Empty Wishlist View
  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <img src={gif} alt="Empty Wishlist" className="h-32 mb-5" />

        <h1 className="text-3xl font-bold text-gray-900">Your Wishlist is Empty</h1>

        <p className="text-gray-500 mt-2 text-center max-w-md">
          Save your favourite foods here and come back whenever you're ready to order.
        </p>

        <button
          className="mt-6 bg-[#ff6547] text-white px-7 py-3 rounded-full font-semibold hover:bg-[#f5573a] transition"
          onClick={() => navigate("/explore")}
        >
          Explore Foods
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf8] px-5 md:px-10 lg:px-20 py-10 font-sans">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[3px] text-[#ff6547] uppercase mb-2">
              Your Favorites
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-500 mt-2">
              {wishlistItems.length} {wishlistItems.length === 1 ? "food" : "foods"} saved for later
            </p>
          </div>

          {/* CLEAR WISHLIST BUTTON */}
          <button
            onClick={clearWishlist}
            className="self-start sm:self-auto text-sm text-red-500 hover:text-red-600 font-medium border border-red-100 px-4 py-2 rounded-full hover:bg-red-50 transition active:scale-95"
          >
            Clear Wishlist
          </button>
        </div>
      </div>

      {/* Wishlist Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((product, index) => {
          const productId = String(product._id || product.id || index);
          const price = Number(product.price) || 0;
          const discount = Number(product.discount) || 0;
          const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;
          const image = product.image || product.images?.[0] || "https://via.placeholder.com/300";

          return (
            <div
              key={productId}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between"
            >
              <div className="relative overflow-hidden bg-gray-100 h-56">
                <img
                  src={image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {discount > 0 && (
                  <span className="absolute top-4 left-4 bg-green-100 text-green-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                    {discount}% OFF
                  </span>
                )}

                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 shadow-sm flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition active:scale-90"
                  title="Remove from wishlist"
                >
                  ♥
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 line-clamp-1">{product.name}</h2>
                      <p className="text-sm text-gray-500 mt-1 capitalize">{product.category || "General"}</p>
                    </div>
                    <span className="text-[#ff6547] text-lg">♥</span>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-xl font-bold text-[#ff6547]">
                      ₹{finalPrice.toFixed(2)}
                    </span>
                    {discount > 0 && (
                      <span className="text-sm text-gray-400 line-through">
                        ₹{price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => navigate(`/food/${productId}`)}
                    className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-50 transition"
                  >
                    View Food
                  </button>

                  <button
                    onClick={() => {
                      addToCart(product, 1);
                      navigate("/cart");
                    }}
                    className="flex-1 bg-[#ff6547] text-white py-2.5 rounded-full text-sm font-semibold hover:bg-[#f5573a] transition shadow-sm active:scale-95"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}