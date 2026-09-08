// src/components/home/OffersSection.jsx
import { useNavigate } from "react-router-dom";
import { Tag } from "lucide-react";

const OffersSection = ({ offers }) => {
  const navigate = useNavigate();

  return (
    <section className="bg-[#FFF9F6]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1F1F1F] mb-6">
          Special Offers
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
            >
              <img
                src={offer.image}
                alt={offer.restaurantName}
                className="w-full h-28 object-cover"
              />
              <div className="p-4 flex flex-col gap-2 flex-1">
                <p className="text-lg font-bold text-[#FF6840]">
                  {offer.title}
                </p>
                <p className="text-sm text-[#1F1F1F]">{offer.description}</p>
                <p className="text-xs text-[#6B7280]">{offer.restaurantName}</p>

                <button
                  type="button"
                  onClick={() => navigate(`/offers?code=${offer.code}`)}
                  className="mt-auto flex items-center justify-center gap-1.5 text-xs font-medium text-[#FF6840] border border-dashed border-[#FF6840] rounded-full py-1.5 hover:bg-orange-50 transition-colors"
                >
                  <Tag className="w-3.5 h-3.5" />
                  {offer.code}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OffersSection;