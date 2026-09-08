// src/components/home/HeroSection.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const HeroSection = ({ hero }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/foods?search=${encodeURIComponent(trimmed)}` : "/foods");
  };

  const handleSuggestedClick = (term) => {
    setQuery(term);
    navigate(`/foods?search=${encodeURIComponent(term)}`);
  };

  return (
    <section className="bg-white">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Text + search */}
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-[#1F1F1F]">
              {hero.title}{" "}
              <span className="text-[#FF6840]">{hero.highlight}</span>
            </h1>

            <p className="mt-4 text-base text-[#6B7280] max-w-md">
              {hero.description}
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-6 flex items-center gap-2 bg-white border border-gray-200 rounded-full pl-5 pr-2 py-2 shadow-sm max-w-md focus-within:ring-2 focus-within:ring-[#FF6840]/30"
            >
              <Search className="w-5 h-5 text-[#FF6840] shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for restaurants or food..."
                className="w-full bg-transparent outline-none text-sm text-[#1F1F1F] placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="shrink-0 bg-[#FF6840] hover:bg-[#FF625D] text-white text-sm font-medium px-5 py-2 rounded-full transition-colors"
              >
                Search
              </button>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-[#6B7280]">Suggested:</span>
              {hero.suggestedSearches.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => handleSuggestedClick(term)}
                  className="text-sm text-[#1F1F1F] bg-[#FFF9F6] hover:bg-orange-50 border border-gray-100 px-3 py-1 rounded-full transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <img
              src={hero.image}
              alt="Delicious food ready for delivery"
              className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-3xl shadow-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;