// src/components/home/ServiceBanner.jsx
import { useNavigate } from "react-router-dom";

const ServiceBanner = ({ service }) => {
  const navigate = useNavigate();

  return (
    <section className="bg-[#FFF9F6]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#FF6840] rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            <div className="p-8 sm:p-10 lg:p-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
                {service.heading}
              </h2>
              <p className="text-white/90 text-sm sm:text-base mt-4 max-w-md">
                {service.description}
              </p>
              <button
                type="button"
                onClick={() => navigate("/restaurants")}
                className="mt-6 bg-white text-[#FF6840] hover:bg-[#1F1F1F] hover:text-white text-sm font-medium px-6 py-2.5 rounded-full transition-colors"
              >
                {service.buttonText}
              </button>
            </div>

            <img
              src={service.image}
              alt="Delivery rider bringing food anytime"
              className="w-full h-56 sm:h-72 lg:h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceBanner;