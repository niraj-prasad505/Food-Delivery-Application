// src/components/home/NearbyRestaurants.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NearbyRestaurants = ({ restaurants = [] }) => {
  const navigate = useNavigate();
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section className="bg-[#FFF9F6] py-10 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1F1F1F] mb-5">
          Nearby Restaurants
        </h2>
      </div>

      {/* Marquee & Manual Swipe Container */}
      <div
        className="w-full overflow-x-auto scrollbar-none cursor-grab active:cursor-grabbing px-4 sm:px-6 lg:px-8"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div
          className="flex gap-4 w-max animate-smooth-glide"
          style={{
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {restaurants.map((restaurant) => {
            const restaurantId = restaurant._id || restaurant.id;
            const restaurantImage =
              restaurant.icon ||
              restaurant.banner ||
              restaurant.image ||
              "https://via.placeholder.com/150";

            return (
              <button
                key={restaurantId}
                type="button"
                onClick={() => navigate(`/restaurant/${restaurantId}`)}
                className="flex items-center gap-3 bg-white rounded-full pr-5 pl-2 py-2 shadow-sm hover:shadow-md transition-shadow shrink-0 text-left cursor-pointer"
              >
                <img
                  src={restaurantImage}
                  alt={restaurant.name}
                  className="w-12 h-12 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#1F1F1F] truncate max-w-32.5">
                    {restaurant.name}
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    {restaurant.deliveryTime || "25–35 min"} · {restaurant.rating || 4.5}★
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Smooth back-and-forth glide with zero blank gaps */}
      <style>{`
        @keyframes smoothGlide {
          0% { transform: translateX(0%); }
          100% { transform: translateX(calc(-100% + 100vw)); }
        }
        .animate-smooth-glide {
          animation: smoothGlide 25s ease-in-out infinite alternate;
        }
      `}</style>
    </section>
  );
};

export default NearbyRestaurants;