// src/components/home/PopularRestaurants.jsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Star, Clock } from "lucide-react";

// Filter Categories
const CATEGORY_FILTERS = [
  { id: "all", name: "All" },
  { id: "pizza", name: "Pizza" },
  { id: "burger", name: "Burger" },
  { id: "biryani", name: "Biryani" },
  { id: "indian", name: "Indian" },
  { id: "chicken", name: "Chicken" },
  { id: "chinese", name: "Chinese" },
  { id: "healthy", name: "Healthy" },
  { id: "desserts", name: "Desserts" },
  { id: "beverages", name: "Beverages" },
];

const PopularRestaurants = ({ restaurants = [] }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [favorites, setFavorites] = useState(new Set());
  const navigate = useNavigate();

  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Dynamic filter logic:
  // 1. If "all", sample up to 2 restaurants per tag category
  // 2. If a specific filter is clicked, show ONLY matching restaurants
  const filteredRestaurants = useMemo(() => {
    if (activeFilter === "all") {
      const tagCounts = {};
      const result = [];

      for (const shop of restaurants) {
        const tags = shop.tags || ["Fast Food"];
        let shouldAdd = false;

        for (const tag of tags) {
          const lowerTag = tag.toLowerCase();
          const count = tagCounts[lowerTag] || 0;
          if (count < 2) {
            tagCounts[lowerTag] = count + 1;
            shouldAdd = true;
          }
        }

        if (shouldAdd) {
          result.push(shop);
        }
      }
      return result;
    }

    // Specific category filter
    return restaurants.filter((shop) =>
      shop.tags?.some((tag) => tag.toLowerCase() === activeFilter.toLowerCase())
    );
  }, [activeFilter, restaurants]);

  return (
    <section className="bg-white py-10">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1F1F1F]">
              Popular Restaurants
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Top-rated dining options delivering to your location
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-full">
            {CATEGORY_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                className={`text-xs sm:text-sm px-4 py-1.5 rounded-full border font-semibold whitespace-nowrap transition-all ${
                  activeFilter === filter.id
                    ? "bg-[#FF6840] text-white border-[#FF6840] shadow-sm"
                    : "bg-white text-gray-700 border-gray-200 hover:border-[#FF6840] hover:text-[#FF6840]"
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal Swipeable Cards (No Scrollbar, No Marquee) */}
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-none cursor-grab active:cursor-grabbing">
          {filteredRestaurants.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-sm w-full">
              No popular restaurants found in this category.
            </div>
          ) : (
            filteredRestaurants.map((restaurant) => {
              const restaurantId = restaurant._id || restaurant.id;
              
              // Fixed image fallback prioritizing icon/logo first
              const restaurantImage =
                restaurant.icon ||
                restaurant.banner ||
                restaurant.image ||
                "https://via.placeholder.com/400x200";

              const cuisineTags =
                restaurant.tags?.join(", ") || restaurant.cuisine || "Fast Food";

              return (
                <div
                  key={restaurantId}
                  onClick={() => navigate(`/restaurant/${restaurantId}`)}
                  className="w-72 sm:w-80 bg-white rounded-2xl p-3 border border-gray-100 shadow-sm hover:shadow-md transition-all shrink-0 cursor-pointer flex flex-col justify-between"
                >
                  {/* Image & Favorite Button */}
                  <div className="h-40 w-full rounded-xl overflow-hidden bg-gray-100 relative mb-3">
                    <img
                      src={restaurantImage}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(e, restaurantId)}
                      className="absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow-sm hover:bg-white transition-all"
                      aria-label="Toggle favorite"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          favorites.has(restaurantId)
                            ? "fill-[#FF6840] text-[#FF6840]"
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Details */}
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-900 text-base truncate max-w-47.5">
                        {restaurant.name}
                      </h3>
                      <span className="flex items-center gap-1 text-xs font-bold text-orange-500 shrink-0">
                        <Star className="w-3.5 h-3.5 fill-orange-500 stroke-orange-500" />
                        {restaurant.rating || 4.5}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 truncate">
                      {cuisineTags}
                    </p>
                  </div>

                  {/* Delivery Info */}
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-50 text-xs text-gray-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {restaurant.deliveryTime || "20-30 min"}
                    </span>
                    <span className="text-emerald-600 font-bold">
                      {restaurant.freeDelivery !== false ? "Free Delivery" : `Min. ₹${restaurant.minOrder || 199}`}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default PopularRestaurants;