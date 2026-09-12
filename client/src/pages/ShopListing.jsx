import React, { useState, useEffect } from "react";
import { Search, Filter, Heart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  { id: "all", name: "All", icon: "🍱" },
  { id: "pizza", name: "Pizza", icon: "🍕" },
  { id: "burger", name: "Burger", icon: "🍔" },
  { id: "biryani", name: "Biryani", icon: "🍲" },
  { id: "chinese", name: "Chinese", icon: "🥢" },
  { id: "indian", name: "Indian", icon: "🥘" },
  { id: "desserts", name: "Desserts", icon: "🍩" },
];

export default function ShopListing() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    // Connects directly to backend public route
    fetch("http://localhost:5000/api/shops/public")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setShops(data.shops);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch shops:", err);
        setLoading(false);
      });
  }, []);

  const filteredShops = shops.filter((shop) => {
    const matchesSearch =
      shop.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.city?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans">
      <main className="max-w-6xl mx-auto px-4 py-8 w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Restaurants Near You</h1>

        {/* Search Bar & Filters */}
        <div className="flex items-center gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for restaurants, city, cuisines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-3 border border-gray-200 bg-white rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
            <Filter className="w-4 h-4 text-orange-500" />
            Filter
          </button>
        </div>

        {/* Categories Bar */}
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

        {/* Restaurant List connected to Mongoose Shop schema */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading restaurants...</div>
        ) : filteredShops.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No restaurants found.</div>
        ) : (
          <div className="flex flex-col gap-6">
            {filteredShops.map((shop) => (
              <div
                key={shop._id}
                onClick={() => navigate(`/restaurant/${shop._id}`)}
                className="bg-white rounded-2xl p-4 flex gap-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer relative"
              >
                {/* Image */}
                <div className="w-44 h-36 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={shop.icon || shop.images?.[0] || "https://via.placeholder.com/200"}
                    alt={shop.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex items-start justify-between">
                      <h2 className="text-xl font-bold text-gray-900">{shop.name}</h2>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle wishlist action
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-1">{shop.address}, {shop.city}</p>

                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mt-2">
                      <span className="flex items-center gap-1 text-orange-500 font-bold">
                        <Star className="w-4 h-4 fill-orange-500 stroke-orange-500" />
                        4.5
                      </span>
                      <span>•</span>
                      <span>Delivery within {shop.deliveryRadiusKm || 5} km</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-emerald-600 font-bold text-sm block">
                      {shop.isOpen ? "Open Now" : "Closed"}
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