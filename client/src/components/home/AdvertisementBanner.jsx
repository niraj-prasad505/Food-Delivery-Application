import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

const AdvertisementBanner = ({ advertisements }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (advertisements.length <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) =>
        (prev + 1) % advertisements.length
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [advertisements.length]);

  if (!advertisements.length) return null;

  const advertisement = advertisements[current];

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 md:px-6">

      <div
        className="
          relative overflow-hidden rounded-3xl
          bg-gradient-to-r from-[#ff6b4a] to-[#ff956b]
          transition-all duration-700
        "
      >

        <div className="grid min-h-[250px] items-center md:grid-cols-2">

          <div className="z-10 p-8 md:p-12">

            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
              Special Offer
            </span>

            <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
              {advertisement.title}
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-white/90">
              {advertisement.description}
            </p>

            <button className="mt-6 flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#ff6840]">
              {advertisement.buttonText}
              <ArrowRight size={16} />
            </button>

          </div>

          <div className="hidden h-full md:block">

            <img
              src={advertisement.image}
              alt={advertisement.title}
              className="h-full w-full object-cover"
            />

          </div>

        </div>

        {/* Slider indicators */}

        <div className="absolute bottom-5 left-8 flex gap-2">

          {advertisements.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2 rounded-full transition-all ${
                current === index
                  ? "w-7 bg-white"
                  : "w-2 bg-white/50"
              }`}
            />
          ))}

        </div>

      </div>

    </section>
  );
};

export default AdvertisementBanner;