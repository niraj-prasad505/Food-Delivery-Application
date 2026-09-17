// src/pages/ExploreFoods.jsx
import { useMemo, useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, ArrowUpDown, Check, Flame, Star, ArrowUp, ArrowDown } from "lucide-react";

import ExploreHero from "../components/explore/ExploreHero";
import CategoryFilter from "../components/explore/CategoryFilter";
import FoodGrid from "../components/explore/FoodGrid";

// Fallback dataset
import { foodsData as fallbackFoods } from "../data/foodsData";

const SORT_OPTIONS = [
  { id: "popularity", label: "Popularity", icon: Flame },
  { id: "rating", label: "Rating", icon: Star },
  { id: "price-low", label: "Price: Low to High", icon: ArrowUp },
  { id: "price-high", label: "Price: High to Low", icon: ArrowDown },
];

const ExploreFoods = () => {
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get("search") || "";

  // Target ref for smooth scrolling to results
  const resultsRef = useRef(null);

  const [allFoods, setAllFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(urlQuery);
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort] = useState("popularity");

  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);

  const [favorites, setFavorites] = useState(new Set());
  const [cartItems, setCartItems] = useState([]);

  // Auto-scroll ONLY when redirected from Home page search bar (/explore?search=pizza)
  useEffect(() => {
    if (urlQuery) {
      setSearch(urlQuery);
      setActiveCategory("all");
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  }, [urlQuery]);

  // Typing Handler: Filters live quietly without scrolling the screen
  const handleSearchChange = (newQuery) => {
    setSearch(newQuery);
    if (newQuery.trim() !== "") {
      setActiveCategory("all");
    }
  };

  // Search Button Click Handler: Scrolls smoothly down to results grid
  const handleSearchSubmit = () => {
    resultsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Category Pill Click Handler
  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setSearch("");
  };

  // Close sort dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch all foods once on mount
  useEffect(() => {
    fetch("http://localhost:5000/api/foods")
      .then((res) => res.json())
      .then((data) => {
        const rawProducts = Array.isArray(data)
          ? data
          : data.products || data.foods || data.data || [];

        const targetData = rawProducts.length > 0 ? rawProducts : fallbackFoods;

        const normalized = targetData.map((food, index) => ({
          ...food,
          id: String(food._id || food.id || index),
          image: food.image || food.images?.[0] || "https://via.placeholder.com/300",
        }));

        setAllFoods(normalized);
      })
      .catch((err) => {
        console.warn("Backend API unavailable, using fallback foods dataset:", err);
        const normalizedFallback = fallbackFoods.map((food, index) => ({
          ...food,
          id: String(food._id || food.id || index),
          image: food.image || food.images?.[0] || "https://via.placeholder.com/300",
        }));
        setAllFoods(normalizedFallback);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter & Search Logic
  const filteredFoods = useMemo(() => {
    return allFoods.filter((food) => {
      const categoryMatch =
        activeCategory === "all" ||
        food.category?.toLowerCase() === activeCategory.toLowerCase();

      const query = search.toLowerCase().trim();
      const searchMatch =
        !query ||
        food.name?.toLowerCase().includes(query) ||
        food.cuisine?.toLowerCase().includes(query) ||
        food.category?.toLowerCase().includes(query);

      return categoryMatch && searchMatch;
    }).sort((a, b) => {
      if (sort === "rating" || sort === "popularity") {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sort === "price-low") {
        return (a.price || 0) - (b.price || 0);
      }
      if (sort === "price-high") {
        return (b.price || 0) - (a.price || 0);
      }
      return 0;
    });
  }, [allFoods, search, activeCategory, sort]);

  const handleFavorite = (id) => {
    setFavorites((previous) => {
      const updated = new Set(previous);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  const handleAddToCart = (food) => {
    setCartItems((previous) => [...previous, food]);
  };

  const currentSortLabel = SORT_OPTIONS.find((opt) => opt.id === sort)?.label || "Popularity";

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <ExploreHero
        search={search}
        setSearch={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
      />

      <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8">
        {/* CATEGORY FILTER */}
        <CategoryFilter
          activeCategory={activeCategory}
          setActiveCategory={handleCategorySelect}
        />

        {/* TARGET SCROLL ANCHOR */}
        <div ref={resultsRef} className="mb-5 mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#17191c] sm:text-3xl">
              Popular Foods
            </h2>
            <p className="mt-1 text-sm text-[#687586]">
              Handpicked dishes from top restaurants near you
            </p>
          </div>

          <div className="relative" ref={sortRef}>
            <button
              type="button"
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm font-semibold text-gray-700 hover:border-[#FF6840] hover:text-[#FF6840] shadow-sm transition-all duration-200 active:scale-95"
            >
              <ArrowUpDown className="w-4 h-4 text-[#FF6840]" />
              <span>Sort by: <strong className="text-gray-900">{currentSortLabel}</strong></span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`} />
            </button>

            {isSortOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Sort Products
                </div>
                {SORT_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const isSelected = sort === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setSort(option.id);
                        setIsSortOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold transition-all ${
                        isSelected
                          ? "bg-orange-50 text-[#FF6840]"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isSelected ? "text-[#FF6840]" : "text-gray-400"}`} />
                        <span>{option.label}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#FF6840]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm font-medium text-gray-500">
            Loading delicious foods...
          </div>
        ) : (
          <FoodGrid
            foods={filteredFoods}
            favorites={favorites}
            onFavorite={handleFavorite}
            onAddToCart={handleAddToCart}
          />
        )}
      </section>
    </div>
  );
};

export default ExploreFoods;