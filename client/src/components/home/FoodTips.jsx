// src/components/home/FoodTips.jsx
import { Clock3 } from "lucide-react";

const FoodTips = ({ tips }) => {
  return (
    <section className="bg-white">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-sm font-medium text-[#FF6840] mb-1">Blog</p>
        <h2 className="text-xl sm:text-2xl font-bold text-[#1F1F1F] mb-6">
          FoodEx Tips & Tricks
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip) => (
            <article
              key={tip.id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
            >
              <img
                src={tip.image}
                alt={tip.title}
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-4">
                <h3 className="font-semibold text-[#1F1F1F] leading-snug">
                  {tip.title}
                </h3>
                <p className="text-sm text-[#6B7280] mt-2">
                  {tip.description}
                </p>
                <span className="flex items-center gap-1.5 text-xs text-[#6B7280] mt-3">
                  <Clock3 className="w-3.5 h-3.5" />
                  {tip.readTime}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FoodTips;