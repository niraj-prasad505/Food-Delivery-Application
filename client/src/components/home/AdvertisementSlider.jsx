// src/components/home/AdvertisementSlider.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AUTO_SLIDE_INTERVAL = 5000;

const AdvertisementSlider = ({ advertisements }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % advertisements.length);
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, [advertisements.length]);

  const activeAd = advertisements[activeIndex];

  return (
    <section className="bg-white">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="relative rounded-3xl overflow-hidden shadow-md min-h-[260px] sm:min-h-[220px]">
          {/* background image */}
          <img
            src={activeAd.image}
            alt={activeAd.title}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          />
          {/* gradient overlay for readable text */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF6840]/95 via-[#FF6840]/80 to-[#FF6840]/40" />

          <div className="relative flex flex-col justify-center h-full px-6 sm:px-10 py-10 max-w-xl">
            <h3 className="text-white text-2xl sm:text-3xl font-bold leading-snug">
              {activeAd.title}
            </h3>
            <p className="text-white/90 text-sm sm:text-base mt-3">
              {activeAd.description}
            </p>
            <button
              type="button"
              onClick={() => navigate(activeAd.buttonLink)}
              className="mt-6 w-fit bg-[#1F1F1F] hover:bg-black text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
            >
              {activeAd.buttonText}
            </button>
          </div>

          {/* indicator dots */}
          <div className="absolute bottom-5 left-6 sm:left-10 flex items-center gap-2">
            {advertisements.map((ad, index) => (
              <button
                key={ad.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show advertisement ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-6 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvertisementSlider;