import React, { useState, useEffect, useRef } from "react";
import { Search, Filter, Heart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Categories including Healthy, Chicken, and Beverages
const CATEGORIES = [
  { id: "all", name: "All", icon: "🍱" },
  { id: "pizza", name: "Pizza", icon: "🍕" },
  { id: "burger", name: "Burger", icon: "🍔" },
  { id: "biryani", name: "Biryani", icon: "🍲" },
  { id: "chicken", name: "Chicken", icon: "🍗" },
  { id: "healthy", name: "Healthy", icon: "🥗" },
  { id: "beverages", name: "Beverages", icon: "🧋" },
  { id: "chinese", name: "Chinese", icon: "🥢" },
  { id: "indian", name: "Indian", icon: "🥘" },
  { id: "desserts", name: "Desserts", icon: "🍩" },
];

// Expanded Fallback Mock Data matching your database Shop model schema
const MOCK_RESTAURANTS = [
  {
    _id: "mock-1",
    name: "Domino's Pizza",
    rating: 4.5,
    reviewsCount: "1200+",
    deliveryTime: "30–40 mins",
    tags: ["Pizza", "Fast Food"],
    freeDelivery: true,
    minOrder: 199,
    city: "Amborkhana, Sylhet",
    address: "Central Road",
    isOpen: true,
    icon: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80",
  },
  {
    _id: "mock-7",
    name: "Burger King",
    rating: 4.4,
    reviewsCount: "1100+",
    deliveryTime: "20–30 mins",
    tags: ["Burger", "Fast Food"],
    freeDelivery: true,
    minOrder: 179,
    city: "Amborkhana, Sylhet",
    address: "City Centre",
    isOpen: true,
    icon: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
  },
  {
    _id: "mock-8",
    name: "Royal Indian Cuisine",
    rating: 4.6,
    reviewsCount: "750+",
    deliveryTime: "35–50 mins",
    tags: ["Indian", "Thali", "Curry"],
    freeDelivery: true,
    minOrder: 299,
    city: "Amborkhana, Sylhet",
    address: "Main Road",
    isOpen: true,
    icon: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=80",
  },
  {
    _id: "mock-9",
    name: "The Sugar Rush Sweets",
    rating: 4.8,
    reviewsCount: "320+",
    deliveryTime: "15–25 mins",
    tags: ["Desserts", "Cakes", "Ice Cream"],
    freeDelivery: false,
    minOrder: 129,
    city: "Amborkhana, Sylhet",
    address: "East Gate",
    isOpen: true,
    icon: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&q=80",
  },
  {
    _id: "mock-2",
    name: "KFC",
    rating: 4.3,
    reviewsCount: "950+",
    deliveryTime: "25–35 mins",
    tags: ["Chicken", "Fast Food"],
    freeDelivery: true,
    minOrder: 199,
    city: "Amborkhana, Sylhet",
    address: "Zindabazar",
    isOpen: true,
    icon: "https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?w=500&q=80",
  },
  {
    _id: "mock-3",
    name: "Behrouz Biryani",
    rating: 4.4,
    reviewsCount: "800+",
    deliveryTime: "30–45 mins",
    tags: ["Biryani", "Mughlai"],
    freeDelivery: true,
    minOrder: 299,
    city: "Amborkhana, Sylhet",
    address: "Nayasarak",
    isOpen: true,
    icon: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80",
  },
  {
    _id: "mock-4",
    name: "Subway Healthy Bowls",
    rating: 4.6,
    reviewsCount: "500+",
    deliveryTime: "20–30 mins",
    tags: ["Healthy", "Salads", "Sandwiches"],
    freeDelivery: true,
    minOrder: 249,
    city: "Amborkhana, Sylhet",
    address: "Mirabazar",
    isOpen: true,
    icon: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80",
  },
  {
    _id: "mock-5",
    name: "The Boba & Beverage Bar",
    rating: 4.7,
    reviewsCount: "410+",
    deliveryTime: "15–25 mins",
    tags: ["Beverages", "Smoothies", "Boba Tea"],
    freeDelivery: false,
    minOrder: 149,
    city: "Amborkhana, Sylhet",
    address: "Shibganj",
    isOpen: true,
    icon: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&q=80",
  },
  {
    _id: "mock-6",
    name: "Wow! Momo",
    rating: 4.2,
    reviewsCount: "600+",
    deliveryTime: "20–30 mins",
    tags: ["Momos", "Chinese"],
    freeDelivery: true,
    minOrder: 199,
    city: "Amborkhana, Sylhet",
    address: "Chowhatta",
    isOpen: true,
    icon: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=500&q=80",
  },
];

export default function ShopListing() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Ref to handle clicking outside of filter menu
  const filterRef = useRef(null);

  const initialFilters = {
    address: "all",
    maxPrice: 5000,
    freeDelivery: false,
    openNow: false,
    minRating: 0,
    cuisine: "all",
  };

  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [draftFilters, setDraftFilters] = useState(initialFilters);

  // Check if any non-default filter is currently active
  const hasActiveFilters = JSON.stringify(appliedFilters) !== JSON.stringify(initialFilters);
  const [favorites, setFavorites] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/shops/public")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.shops && data.shops.length > 0) {
          setShops(data.shops);
        } else {
          setShops(MOCK_RESTAURANTS);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Backend API offline/empty. Falling back to temporary data:", err);
        setShops(MOCK_RESTAURANTS);
        setLoading(false);
      });
  }, []);

  // Close filter dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleFavorite = (e, shopId) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [shopId]: !prev[shopId] }));
  };

  // Multi-Criteria Dynamic Filter
  const filteredShops = shops.filter((shop) => {
    const query = searchQuery.toLowerCase();

    // Global Search Bar Query
    const matchesSearch =
      shop.name?.toLowerCase().includes(query) ||
      shop.city?.toLowerCase().includes(query) ||
      (shop.tags && shop.tags.some((tag) => tag.toLowerCase().includes(query)));

    // Category Bar Pills
    const matchesCategory =
      selectedCategory === "all" ||
      shop.name?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (shop.tags &&
        shop.tags.some((tag) =>
          tag.toLowerCase().includes(selectedCategory.toLowerCase())
        ));

    // Custom Filter Controls
    const matchesAddress =
      appliedFilters.address === "all" ||
      shop.city?.toLowerCase().includes(appliedFilters.address.toLowerCase());

    const matchesPrice = (shop.minOrder || 0) <= appliedFilters.maxPrice;
    const matchesFreeDelivery = !appliedFilters.freeDelivery || shop.freeDelivery === true;
    const matchesOpenNow = !appliedFilters.openNow || shop.isOpen === true;
    const matchesRating = (shop.rating || 0) >= appliedFilters.minRating;

    const matchesCuisine =
      appliedFilters.cuisine === "all" ||
      (shop.tags &&
        shop.tags.some(
          (tag) => tag.toLowerCase() === appliedFilters.cuisine.toLowerCase()
        ));

    return (
      matchesSearch &&
      matchesCategory &&
      matchesAddress &&
      matchesPrice &&
      matchesFreeDelivery &&
      matchesOpenNow &&
      matchesRating &&
      matchesCuisine
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans">
      <main className="max-w-6xl mx-auto px-4 py-8 w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Restaurants Near You</h1>

        {/* Search Bar & Inline Floating Filter Dropdown */}
        <div className="flex items-center gap-3 mb-8 relative">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for restaurants, city, cuisines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6840] shadow-sm"
            />
          </div>

          {/* Filter Button Container (Attached ref for click outside) */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => {
                setDraftFilters(appliedFilters);
                setIsFilterOpen(!isFilterOpen);
              }}
              className="flex items-center gap-2 px-6 py-3 border border-gray-200 bg-white rounded-full text-sm font-semibold text-gray-700 hover:bg-orange-50 hover:border-[#ff6840] hover:text-[#ff6840] transition-all duration-200 shadow-sm active:scale-95 shrink-0"
            >
              <Filter className="w-4 h-4 text-[#ff6840]" />
              <span>Filter</span>
              {hasActiveFilters && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff6840] animate-pulse"></span>
              )}
            </button>

            {/* Small Inline Popover Window */}
            {isFilterOpen && (
              <div className="absolute right-0 top-14 z-50 bg-white rounded-3xl w-80 p-5 shadow-2xl border border-orange-100 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Quick Filters
                  </span>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="text-gray-400 hover:text-gray-600 font-bold text-sm"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Location */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                      📍 Location
                    </label>
                    <select
                      value={draftFilters.address}
                      onChange={(e) =>
                        setDraftFilters({ ...draftFilters, address: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-xs font-semibold rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#ff6840]"
                    >
                      <option value="all">All Locations</option>
                      <option value="Amborkhana, Sylhet">Amborkhana, Sylhet</option>
                      <option value="Zindabazar">Zindabazar</option>
                      <option value="Nayasarak">Nayasarak</option>
                      <option value="Chowhatta">Chowhatta</option>
                    </select>
                  </div>

                  {/* Budget Range Chips */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                      💰 Budget
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { label: "Under ₹200", max: 200 },
                        { label: "₹200-₹400", max: 400 },
                        { label: "Any Price", max: 5000 },
                      ].map((tier) => (
                        <button
                          key={tier.max}
                          type="button"
                          onClick={() =>
                            setDraftFilters({ ...draftFilters, maxPrice: tier.max })
                          }
                          className={`py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                            draftFilters.maxPrice === tier.max
                              ? "bg-[#ff6840] text-white border-[#ff6840]"
                              : "bg-gray-50 text-gray-600 border-gray-200"
                          }`}
                        >
                          {tier.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rating Slider */}
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-gray-600 uppercase mb-1">
                      <span>⭐ Min Rating</span>
                      <span className="text-[#ff6840]">
                        {draftFilters.minRating === 0
                          ? "Any"
                          : `${draftFilters.minRating}+`}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.5"
                      value={draftFilters.minRating}
                      onChange={(e) =>
                        setDraftFilters({
                          ...draftFilters,
                          minRating: Number(e.target.value),
                        })
                      }
                      className="w-full accent-[#ff6840] cursor-pointer h-1 bg-gray-200 rounded-lg appearance-none"
                    />
                  </div>

                  {/* Quick Toggles */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setDraftFilters({
                          ...draftFilters,
                          freeDelivery: !draftFilters.freeDelivery,
                        })
                      }
                      className={`p-2 rounded-xl border text-[11px] font-bold transition-all text-center ${
                        draftFilters.freeDelivery
                          ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                          : "bg-gray-50 text-gray-600 border-gray-200"
                      }`}
                    >
                      🚀 Free Delivery
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setDraftFilters({
                          ...draftFilters,
                          openNow: !draftFilters.openNow,
                        })
                      }
                      className={`p-2 rounded-xl border text-[11px] font-bold transition-all text-center ${
                        draftFilters.openNow
                          ? "bg-orange-50 text-[#ff6840] border-[#ff6840]"
                          : "bg-gray-50 text-gray-600 border-gray-200"
                      }`}
                    >
                      ⚡ Open Now
                    </button>
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setDraftFilters(initialFilters);
                      setAppliedFilters(initialFilters);
                    }}
                    className="flex-1 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs hover:bg-gray-200 transition-all"
                  >
                    Reset 🔄
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAppliedFilters(draftFilters);
                      setIsFilterOpen(false);
                    }}
                    className="flex-1 py-2 bg-[#ff6840] text-white font-bold rounded-xl text-xs hover:bg-[#e05530] transition-all shadow-md shadow-orange-100"
                  >
                    Apply ✨
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-6 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="flex flex-col items-center gap-2 min-w-[64px]"
            >
              <div
                className={`w-14 h-14 mt-1 rounded-full flex items-center justify-center text-xl transition-all ${
                  selectedCategory === cat.id
                    ? "bg-red-100 ring-2 ring-red-500 shadow-sm"
                    : "bg-orange-50 hover:bg-orange-100"
                }`}
              >
                {cat.icon}
              </div>
              <span
                className={`text-xs font-medium ${
                  selectedCategory === cat.id ? "text-red-600 font-bold" : "text-gray-600"
                }`}
              >
                {cat.name}
              </span>
            </button>
          ))}
        </div>

        {/* Restaurant Cards List */}
        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading restaurants...</div>
        ) : filteredShops.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">No restaurants found.</div>
        ) : (
          <div className="flex flex-col gap-6">
            {filteredShops.map((shop) => (
              <div
                key={shop._id}
                onClick={() => navigate(`/restaurant/${shop._id}`)}
                className="bg-white rounded-2xl p-4 flex gap-6 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer relative"
              >
                {/* Image */}
                <div className="w-44 h-36 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={shop.icon || shop.images?.[0] || "https://via.placeholder.com/200"}
                    alt={shop.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Left Info Section (Details & Explore Button) */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">{shop.name}</h2>

                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mt-1">
                      <span className="flex items-center gap-1 text-orange-500 font-bold">
                        <Star className="w-4 h-4 fill-orange-500 stroke-orange-500" />
                        {shop.rating || 4.5}
                      </span>
                      <span className="text-gray-400">({shop.reviewsCount || "500+"})</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-600">{shop.deliveryTime || "25–35 mins"}</span>
                    </div>

                    <div className="flex gap-2 mt-2.5">
                      {(shop.tags || ["Fast Food"]).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Explore Menu Button (Navigates directly to /restaurant/:id/menu) */}
                  <div className="mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/restaurant/${shop._id}/menu`);
                      }}
                      className="px-4 py-1.5 bg-orange-50 text-[#ff6840] hover:bg-[#ff6840] hover:text-white font-bold text-xs rounded-xl transition-all shadow-sm border border-orange-100"
                    >
                      Explore Menu ✨
                    </button>
                  </div>
                </div>

                {/* Right Action Panel (Heart, Delivery Status & Min Order) */}
                <div className="flex flex-col justify-between items-end py-1 shrink-0">
                  <button
                    onClick={(e) => toggleFavorite(e, shop._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        favorites[shop._id]
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </button>

                  <div className="text-right">
                    <span className="text-emerald-600 font-bold text-sm block">
                      {shop.freeDelivery !== false ? "Free Delivery" : "Paid Delivery"}
                    </span>
                    <span className="text-xs text-gray-400 font-medium block mt-0.5">
                      Min. order ₹{shop.minOrder || 199}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}