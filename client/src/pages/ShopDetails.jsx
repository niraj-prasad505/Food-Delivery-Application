import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Heart, ArrowLeft, Share2 } from "lucide-react";

// 1. Mock Database of All 9 Registered Shops
const MOCK_RESTAURANTS = [
  {
    _id: "mock-1",
    name: "Domino's Pizza",
    rating: 4.5,
    reviewsCount: "1200+",
    deliveryTime: "20–40 mins",
    tags: ["Pizza", "Fast Food"],
    freeDelivery: true,
    minOrder: 199,
    description: "Delicious pizzas, sides and more. Made with the freshest ingredients.",
    banner: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&q=80",
    icon: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80",
    address: "Central Road, Amborkhana, Sylhet",
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
    description: "Flame-grilled burgers, crispy fries, and cold beverages.",
    banner: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80",
    icon: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
    address: "City Centre, Amborkhana, Sylhet",
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
    description: "Authentic Indian thalis, rich curries, and freshly baked naans.",
    banner: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1200&q=80",
    icon: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=80",
    address: "Main Road, Amborkhana, Sylhet",
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
    description: "Decadent cakes, pastries, ice creams, and sweet delights.",
    banner: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1200&q=80",
    icon: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&q=80",
    address: "East Gate, Amborkhana, Sylhet",
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
    description: "Crispy fried chicken, buckets, burgers, and sides.",
    banner: "https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?w=1200&q=80",
    icon: "https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?w=500&q=80",
    address: "Zindabazar, Sylhet",
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
    description: "Royal Mughlai biryanis cooked with aromatic spices.",
    banner: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&q=80",
    icon: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80",
    address: "Nayasarak, Sylhet",
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
    description: "Fresh custom sub sandwiches, salad bowls, and wraps.",
    banner: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=80",
    icon: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80",
    address: "Mirabazar, Sylhet",
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
    description: "Refreshing boba teas, fruit smoothies, and iced coffees.",
    banner: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1200&q=80",
    icon: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&q=80",
    address: "Shibganj, Sylhet",
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
    description: "Steamed, fried, and pan-fried momos with spicy chutney.",
    banner: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=1200&q=80",
    icon: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=500&q=80",
    address: "Chowhatta, Sylhet",
  },
];

// 2. Mapped Menus Categorized per Shop ID
const MOCK_MENUS = {
  "mock-1": [
    { id: "m1", category: "Pizza", name: "Margherita Pizza", description: "Classic delight with 100% real mozzarella cheese.", price: 199, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&q=80" },
    { id: "m2", category: "Pizza", name: "Farmhouse Pizza", description: "Loaded with veggies and cheese.", price: 249, image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&q=80" },
    { id: "m3", category: "Pizza", name: "Peppy Paneer Pizza", description: "Paneer, capsicum and red paprika.", price: 249, image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=300&q=80" },
    { id: "m4", category: "Sides", name: "Garlic Breadsticks", description: "Baked to a golden brown, seasoned with garlic butter.", price: 99, image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=300&q=80" },
    { id: "m5", category: "Beverages", name: "Iced Pepsi (500ml)", description: "Chilled carbonated soft drink.", price: 59, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&q=80" },
  ],
  "mock-7": [
    { id: "m6", category: "Burgers", name: "Whopper Burger", description: "Flame-grilled beef patty with juicy tomatoes and lettuce.", price: 179, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80" },
    { id: "m7", category: "Sides", name: "Crispy French Fries", description: "Golden salted potato fries.", price: 89, image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=300&q=80" },
  ],
  default: [
    { id: "m8", category: "Popular", name: "Chef's Special Meal Box", description: "House signature combo dish served hot.", price: 229, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80" },
    { id: "m9", category: "Beverages", name: "Fresh Lemon Soda", description: "Sweet and salty refreshing fizzy drink.", price: 49, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300&q=80" },
  ],
};

export default function ShopDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Menu");
  const [favorite, setFavorite] = useState(false);
  const [cart, setCart] = useState({});

  // Get matching menu items or fallback to default menu
  const menuItems = MOCK_MENUS[id] || MOCK_MENUS.default;

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
  }, [id]);

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
            
            {/* Sidebar Categories (Highlights ONLY the selected category) */}
            <div className="md:col-span-1 bg-white rounded-2xl p-3 shadow-sm border border-gray-100 h-fit space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
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
                    className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm border border-gray-100 hover:shadow-md transition-all items-center"
                  >
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-base font-bold text-gray-900">{dish.name}</h3>
                        <button className="text-gray-300 hover:text-red-500 transition-colors">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 leading-normal line-clamp-2">
                        {dish.description}
                      </p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-base font-extrabold text-gray-900">₹{dish.price}</span>
                        <button
                          onClick={() => addToCart(dish.id)}
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