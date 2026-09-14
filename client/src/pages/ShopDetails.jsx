import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Heart, ArrowLeft, Share2 } from "lucide-react";

// Centralized Data Sources
import { shopsData as MOCK_RESTAURANTS } from "../data/shopsData";
import { foodsData } from "../data/foodsData";

export default function ShopDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Menu");
  const [favorite, setFavorite] = useState(false);
  const [cart, setCart] = useState({});

  // Get matching menu items from centralized dataset or fallback to default
  const shopFoods = foodsData.filter((item) => item.shopId === id);
  const menuItems = shopFoods.length > 0 ? shopFoods : foodsData;

  // Extract unique categories dynamically from the menu items
  const categories = Array.from(new Set(menuItems.map((item) => item.category)));

  // Single category state tracking
  const [activeCategory, setActiveCategory] = useState("");

  // Auto-scroll to top and fetch shop data on load/ID change
  useEffect(() => {
    window.scrollTo(0, 0);

    fetch(`http://localhost:5000/api/shops/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.shop) {
          setShop(data.shop);
        } else {
          const found = MOCK_RESTAURANTS.find((r) => r._id === id) || {
            _id: id,
            name: "Restaurant Partner",
            rating: 4.5,
            reviewsCount: "500+",
            deliveryTime: "25–35 mins",
            tags: ["Fast Food"],
            freeDelivery: true,
            minOrder: 199,
            description: "Quality food delivered fast to your doorstep.",
            banner: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
            icon: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80",
            address: "Main City Road",
          };
          setShop(found);
        }
        setLoading(false);
      })
      .catch(() => {
        const found = MOCK_RESTAURANTS.find((r) => r._id === id) || {
          _id: id,
          name: "Restaurant Partner",
          rating: 4.5,
          reviewsCount: "500+",
          deliveryTime: "25–35 mins",
          tags: ["Fast Food"],
          freeDelivery: true,
          minOrder: 199,
          description: "Quality food delivered fast to your doorstep.",
          banner: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
          icon: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80",
          address: "Main City Road",
        };
        setShop(found);
        setLoading(false);
      });
  }, [id]);

  // Reset default selected category whenever the shop/menu changes
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

  // Filter items for the selected sidebar category
  const filteredDishes = menuItems.filter((item) => item.category === activeCategory);

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
              src={shop.banner}
              alt={shop.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 relative pt-4">
            <div className="flex justify-between items-start">
              <div className="flex items-end gap-4 -mt-16 mb-2">
                <div className="w-24 h-24 rounded-full bg-white p-1.5 shadow-md border border-gray-100 overflow-hidden shrink-0">
                  <img
                    src={shop.icon}
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
              {shop.description}
            </p>
          </div>
        </div>

        {/* Tab Selection Bar (Menu / Reviews / Information) */}
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
                filteredDishes.map((dish) => (
                  <div
                    key={dish.id}
                    onClick={() => navigate(`/food/${dish.id}`)}
                    className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm border border-gray-100 hover:shadow-md transition-all items-center cursor-pointer"
                  >
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
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
                            addToCart(dish.id);
                          }}
                          className="px-6 py-1.5 bg-[#ff6840] hover:bg-[#e05530] text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95"
                        >
                          Add {cart[dish.id] ? `(${cart[dish.id]})` : ""}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "Reviews" && (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-400 text-sm shadow-sm border border-gray-100">
            ⭐ {shop.rating} average rating out of {shop.reviewsCount} verified customer reviews.
          </div>
        )}

        {/* Information Tab */}
        {activeTab === "Information" && (
          <div className="bg-white rounded-2xl p-6 text-sm text-gray-600 space-y-3 shadow-sm border border-gray-100">
            <p><strong>Address:</strong> {shop.address || "Main City Road"}</p>
            <p><strong>Opening Hours:</strong> 10:00 AM – 11:00 PM</p>
            <p><strong>Contact:</strong> +880 1700-000000</p>
          </div>
        )}
      </div>
    </div>
  );
}