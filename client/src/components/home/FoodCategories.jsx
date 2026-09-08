// src/components/home/FoodCategories.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FoodCategories = ({ categories, filters }) => {
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/foods?category=${encodeURIComponent(category.name.toLowerCase())}`);
  };

  return (
    <section className="bg-white">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1F1F1F]">
            Top Foods Categories
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategoryClick(category)}
              className="group text-left"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-sm">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-32 sm:h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2 left-2 bg-[#FF6840] text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
                  {category.restaurantCount} Restaurants
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-[#1F1F1F]">
                {category.name}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FoodCategories;