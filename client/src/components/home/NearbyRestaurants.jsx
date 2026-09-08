// src/components/home/NearbyRestaurants.jsx
import { useNavigate } from "react-router-dom";

const NearbyRestaurants = ({ restaurants }) => {
  const navigate = useNavigate();

  return (
    <section className="bg-[#FFF9F6]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1F1F1F] mb-5">
          Nearby Restaurants
        </h2>

        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:overflow-visible scrollbar-none">
          {restaurants.map((restaurant) => (
            <button
              key={restaurant.id}
              type="button"
              onClick={() => navigate(`/restaurants/${restaurant.id}`)}
              className="flex items-center gap-3 bg-white rounded-full pr-5 pl-2 py-2 shadow-sm hover:shadow-md transition-shadow shrink-0 sm:shrink text-left"
            >
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-12 h-12 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#1F1F1F] truncate">
                  {restaurant.name}
                </p>
                <p className="text-xs text-[#6B7280]">
                  {restaurant.deliveryTime} · {restaurant.rating}★
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NearbyRestaurants;