// src/components/home/PopularRestaurants.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Star, Clock } from "lucide-react";

const PopularRestaurants = ({ restaurants, filters }) => {
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [favorites, setFavorites] = useState(
    () =>
      new Set(
        restaurants.filter((r) => r.isFavorite).map((r) => r.id)
      )
  );
  const navigate = useNavigate();

  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <section className="bg-white">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1F1F1F]">
            Popular Restaurants
          </h2>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
                  activeFilter === filter
                    ? "bg-[#FF6840] text-white border-[#FF6840]"
                    : "bg-white text-[#1F1F1F] border-gray-200 hover:border-[#FF6840]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              onClick={() => navigate(`/restaurants/${restaurant.id}`)}
              className="group cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="relative">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  type="button"
                  onClick={(e) => toggleFavorite(e, restaurant.id)}
                  className="absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow-sm"
                  aria-label="Toggle favorite"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      favorites.has(restaurant.id)
                        ? "fill-[#FF6840] text-[#FF6840]"
                        : "text-gray-400"
                    }`}
                  />
                </button>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[#1F1F1F]">
                    {restaurant.name}
                  </h3>
                  <span className="text-xs text-[#6B7280]">
                    {restaurant.priceRange}
                  </span>
                </div>
                <p className="text-sm text-[#6B7280] mt-0.5">
                  {restaurant.cuisine}
                </p>

                <div className="flex items-center gap-4 mt-3 text-xs text-[#6B7280]">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-[#FF6840] text-[#FF6840]" />
                    {restaurant.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {restaurant.deliveryTime}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularRestaurants;