import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Heart, ArrowLeft, Share2 } from "lucide-react";

import { shopsData as MOCK_RESTAURANTS } from "../data/shopsData";
import { foodsData as MOCK_FOODS } from "../data/foodsData";

export default function ShopDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [shop, setShop] = useState(null);
  const [allFoods, setAllFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Menu");
  const [favorite, setFavorite] = useState(false);
  const [cart, setCart] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);

    // Fetch single shop and all products simultaneously
    Promise.all([
      fetch(`http://localhost:5000/api/shops/${id}`).then((res) => res.json()),
      fetch("http://localhost:5000/api/foods").then((res) => res.json()),
    ])
      .then(([shopRes, foodsRes]) => {
        // Handle shop response
        if (shopRes.success && shopRes.shop) {
          setShop(shopRes.shop);
        } else {
          setShop(MOCK_RESTAURANTS.find((r) => String(r._id || r.id) === String(id)) || MOCK_RESTAURANTS[0]);
        }

        // Handle foods response
        const foodsList = Array.isArray(foodsRes) ? foodsRes : foodsRes.products || foodsRes.foods || [];
        if (foodsList.length > 0) {
          setAllFoods(foodsList);
        } else {
          setAllFoods(MOCK_FOODS);
        }
      })
      .catch((err) => {
        console.warn("API error, using local fallback data:", err);
        setShop(MOCK_RESTAURANTS.find((r) => String(r._id || r.id) === String(id)) || MOCK_RESTAURANTS[0]);
        setAllFoods(MOCK_FOODS);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Match menu items connected to this shop ID (handles both MongoDB ObjectId references and mock string IDs)
  const menuItems = allFoods.filter(
    (item) =>
      String(item.shop?._id || item.shop || item.shopId) === String(id)
  );

  const displayMenuItems = menuItems.length > 0 ? menuItems : allFoods;

  // Extract unique categories dynamically from menu items
  const categories = Array.from(new Set(displayMenuItems.map((item) => item.category)));
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    if (categories.length > 0) {
      setActiveCategory(categories[0]);
    }
  }, [id, categories.length]);

  const addToCart = (itemId) => {
    setCart((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };

  if (loading || !shop) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500 font-semibold">
        Loading shop details...
      </div>
    );
  }

  const filteredDishes = displayMenuItems.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans">
      <div className="max-w-4xl mx-auto px-4 py-6 w-full">

        {/* Top Back Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#ff6840] mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Restaurants
        </button>

        {/* Header Cover & Info Card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 mb-6">
          <div className="h-48 md:h-56 w-full bg-gray-200 relative overflow-hidden">
            <img
              src={shop.banner || shop.images?.[0] || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80"}
              alt={shop.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 relative pt-4">
            <div className="flex justify-between items-start">
              <div className="flex items-end gap-4 -mt-16 mb-2">
                <div className="w-24 h-24 rounded-full bg-white p-1.5 shadow-md border border-gray-100 overflow-hidden shrink-0">
                  <img
                    src={shop.icon || shop.banner || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80"}
                    alt={shop.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setFavorite(!favorite)}
                  className="p-2.5 rounded-full border border-gray-100 bg-white hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all shadow-sm"
                >
                  <Heart className={`w-5 h-5 ${favorite ? "fill-red-500 text-red-500" : ""}`} />
                </button>
                <button className="p-2.5 rounded-full border border-gray-100 bg-white hover:bg-orange-50 text-gray-400 hover:text-[#ff6840] transition-all shadow-sm">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">{shop.name}</h1>

            <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm font-medium text-gray-600 mt-2">
              <span className="flex items-center gap-1 text-orange-500 font-bold">
                <Star className="w-4 h-4 fill-orange-500 stroke-orange-500" />
                {shop.rating || 4.5}
              </span>
              <span className="text-gray-400">({shop.reviewsCount || "500+"} reviews)</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-600">{shop.deliveryTime || "20–40 mins"}</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
              <span className="text-emerald-600 font-bold">
                🚀 {shop.freeDelivery !== false ? "Free Delivery" : "Paid Delivery"}
              </span>
              <span>Min. order ₹{shop.minOrder || 199}</span>
            </div>

            <p className="text-xs text-gray-500 mt-3 max-w-xl leading-relaxed">
              {shop.description || "Quality food delivered fast to your doorstep."}
            </p>
          </div>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex border-b border-gray-200 mb-6 bg-white rounded-2xl px-4 pt-2 shadow-sm">
          {["Menu", "Reviews", "Information"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-bold transition-all relative ${
                activeTab === tab
                  ? "text-[#ff6840] border-b-2 border-[#ff6840]"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Menu Tab View */}
        {activeTab === "Menu" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            {/* Sidebar Categories */}
            <div className="md:col-span-1 bg-white rounded-2xl p-3 shadow-sm border border-gray-100 h-fit space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all capitalize ${
                    activeCategory === cat
                      ? "bg-orange-50 text-[#ff6840] border border-orange-100 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 border border-transparent"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Menu Dish Cards */}
            <div className="md:col-span-3 space-y-4">
              {filteredDishes.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center text-gray-400 text-sm">
                  No items in this category yet.
                </div>
              ) : (
                filteredDishes.map((dish) => {
                  const dishId = dish._id || dish.id;
                  const dishImage = dish.images?.[0] || dish.image || "https://via.placeholder.com/150";

                  return (
                    <div
                      key={dishId}
                      onClick={() => navigate(`/food/${dishId}`)}
                      className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm border border-gray-100 hover:shadow-md transition-all items-center cursor-pointer"
                    >
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        <img src={dishImage} alt={dish.name} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-base font-bold text-gray-900">{dish.name}</h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFavorite(!favorite);
                            }}
                            className="text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Heart className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 leading-normal line-clamp-2">
                          {dish.description}
                        </p>
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-base font-extrabold text-gray-900">₹{dish.price}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(dishId);
                            }}
                            className="px-6 py-1.5 bg-[#ff6840] hover:bg-[#e05530] text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95"
                          >
                            Add {cart[dishId] ? `(${cart[dishId]})` : ""}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "Reviews" && (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-400 text-sm shadow-sm border border-gray-100">
            ⭐ {shop.rating || 4.5} average rating out of {shop.reviewsCount || "500+"} verified customer reviews.
          </div>
        )}

        {/* Information Tab */}
        {activeTab === "Information" && (
          <div className="bg-white rounded-2xl p-6 text-sm text-gray-600 space-y-3 shadow-sm border border-gray-100">
            <p><strong>Address:</strong> {shop.address || "Main City Road"}</p>
            <p><strong>Opening Hours:</strong> 10:00 AM – 11:00 PM</p>
            <p><strong>Contact:</strong> {shop.phone || "+880 1700-000000"}</p>
          </div>
        )}
      </div>
    </div>
  );
}