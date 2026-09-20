// src/components/explore/FoodCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, Heart, Plus, Store } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

const FoodCard = ({ food, isFavorite: propIsFav, onFavorite, onAddToCart }) => {
  const navigate = useNavigate();
  
  // Safe Context Access
  const wishlistContext = useWishlist ? useWishlist() : null;
  const cartContext = useCart ? useCart() : null;

  if (!food) return null;

  const foodId = String(food.id || food._id);
  const shopId = food.shop?._id || food.shop || food.shopId;
  const restaurantName = food.restaurant || food.shop?.name || "Partner Restaurant";
  const reviewCount = food.reviewCount || food.reviewsCount || food.reviews || "500+";

  // Check favorite state
  const isFav = wishlistContext?.isFavorite
    ? wishlistContext.isFavorite(foodId)
    : Boolean(propIsFav);

  const handleRestaurantClick = (e) => {
    e.stopPropagation();
    if (shopId) {
      navigate(`/restaurant/${shopId}`);
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (wishlistContext?.toggleWishlist) {
      wishlistContext.toggleWishlist(food);
    } else if (onFavorite) {
      onFavorite(foodId);
    }
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    if (cartContext?.addToCart) {
      cartContext.addToCart(food, 1);
    } else if (onAddToCart) {
      onAddToCart(food);
    }
  };

  return (
    <div
      onClick={() => navigate(`/food/${foodId}`)}
      className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
    >
      {/* Image & Favorite Button */}
      <div className="relative w-full h-40 rounded-xl overflow-hidden bg-gray-100 mb-3">
        <img
          src={food.image || food.images?.[0] || "https://via.placeholder.com/300"}
          alt={food.name || "Food Item"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {food.discount && (
          <span className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
            {food.discount} % off
          </span>
        )}

        <button
          type="button"
          onClick={handleFavoriteClick}
          className="absolute top-2.5 right-2.5 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-all active:scale-90"
        >
          <Heart
            className={`w-4 h-4 ${
              isFav ? "fill-[#FF6840] text-[#FF6840]" : "text-gray-400"
            }`}
          />
        </button>
      </div>

      {/* Details */}
      <div>
        <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">
          {food.name}
        </h3>

        <div className="mt-1.5">
          <button
            type="button"
            onClick={handleRestaurantClick}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF6840] bg-orange-50 hover:bg-[#FF6840] hover:text-white px-2.5 py-1 rounded-lg transition-all border border-orange-100 max-w-full"
          >
            <Store className="w-3 h-3 shrink-0" />
            <span className="truncate">{restaurantName}</span>
          </button>
        </div>

        <div className="flex items-center gap-1 text-xs font-bold text-amber-500 mt-2">
          <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
          <span>{food.rating || 4.5}</span>
          <span className="text-gray-400 font-normal text-[11px]">({reviewCount})</span>
        </div>
      </div>

      {/* Price & Action Button */}
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-50">
        <div className="flex items-center gap-1.5">
          <span className="text-base font-extrabold text-gray-900">
            ₹{food.price}
          </span>
          {food.originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              ₹{food.originalPrice}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddToCartClick}
          className="flex items-center gap-1 px-3 py-1.5 bg-[#FF6840] text-white hover:bg-[#e05530] text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>
    </div>
  );
};

export default FoodCard;