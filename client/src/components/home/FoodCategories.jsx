// src/components/home/FoodCategories.jsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Plus } from "lucide-react";

// Centralized Foods & Categories Data Source
import { categories, foodsData } from "../../data/foodsData";

const FoodCategories = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const navigate = useNavigate();

  // Dynamic filter logic:
  // 1. If "all", pick up to 2 top dishes per category for a balanced sample across all foods
  // 2. If a specific category, show ONLY items matching that category
  const filteredFoods = useMemo(() => {
    if (activeCategory === "all") {
      const categoryCounts = {};
      const result = [];

      for (const food of foodsData) {
        const count = categoryCounts[food.category] || 0;
        if (count < 2) {
          categoryCounts[food.category] = count + 1;
          result.push(food);
        }
      }
      return result;
    }

    // Specific category selected (e.g., "pizza", "burger", "biryani")
    return foodsData.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <section className="bg-white py-10">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Category Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1F1F1F]">
              Popular Foods
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Handpicked dishes from top partner kitchens near you
            </p>
          </div>

          {/* Category Pills Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-full">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`text-xs sm:text-sm px-4 py-2 rounded-full border font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? "bg-[#FF6840] text-white border-[#FF6840] shadow-sm"
                    : "bg-white text-gray-700 border-gray-200 hover:border-[#FF6840] hover:text-[#FF6840]"
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal Swipeable Food Cards */}
        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-none cursor-grab active:cursor-grabbing">
          {filteredFoods.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-sm w-full">
              No popular items found in this category.
            </div>
          ) : (
            filteredFoods.map((food) => (
              <div
                key={food.id}
                onClick={() => navigate(`/food/${food.id}`)}
                className="w-64 sm:w-72 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all shrink-0 cursor-pointer flex flex-col justify-between"
              >
                {/* Food Image */}
                <div className="relative w-full h-40 rounded-xl overflow-hidden bg-gray-100 mb-3">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-full h-full object-cover"
                  />
                  {food.discount && (
                    <span className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {food.discount}
                    </span>
                  )}
                </div>

                {/* Food Details */}
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate max-w-42.5">
                      {food.name}
                    </h3>
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-500 shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                      {food.rating || 4.5}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {food.restaurant}
                  </p>
                </div>

                {/* Price & Action Button */}
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-50">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-extrabold text-[#FF6840]">
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
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/food/${food.id}`);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-[#FF6840] hover:bg-[#FF6840] hover:text-white text-xs font-bold rounded-xl transition-all border border-orange-100"
                  >
                    <Plus className="w-3.5 h-3.5" /> View
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default FoodCategories;