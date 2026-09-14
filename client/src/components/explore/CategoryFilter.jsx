// src/components/explore/CategoryFilter.jsx
import React from "react";
import { categories } from "../../data/foodsData";

export default function CategoryFilter({ activeCategory, setActiveCategory }) {
  return (
    <div className="w-full overflow-x-auto scrollbar-none py-4">
      <div className="flex items-center gap-6 min-w-max">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="flex flex-col items-center gap-2 cursor-pointer group"
          >
            <div
              className={`w-14 h-14 ml-1 rounded-full flex items-center justify-center text-xl transition-all ${
                activeCategory === cat.id
                  ? "bg-red-100 ring-2 ring-red-500 shadow-sm"
                  : "bg-orange-50 hover:bg-orange-100"
              }`}
            >
              {cat.icon}
            </div>
            <span
              className={`text-xs font-medium transition-colors ${
                activeCategory === cat.id ? "text-red-600 font-bold" : "text-gray-600 group-hover:text-gray-900"
              }`}
            >
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
