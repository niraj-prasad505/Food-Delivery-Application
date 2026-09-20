// src/pages/ProductDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  Heart,
  ArrowLeft,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  RefreshCw,
  Store,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { getProductById } from "../services/productService";
import { foodsData as MOCK_FOODS } from "../data/foodsData";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isFavorite } = useWishlist();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Description");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setError(null);

    // 1. Fetch live product from MongoDB via backend API
    getProductById(id)
      .then((data) => {
        if (data.success && data.product) {
          setProduct(data.product);
          const firstImg = data.product.images?.[0] || data.product.image || "https://via.placeholder.com/600";
          setSelectedImage(firstImg);
        } else {
          fallbackToMock(id);
        }
      })
      .catch(() => {
        fallbackToMock(id);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // Fallback for mock/demo IDs (e.g., "m1", "m8")
  const fallbackToMock = (productId) => {
    const foundProduct = MOCK_FOODS?.find(
      (item) => String(item.id || item._id) === String(productId)
    );

    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedImage(foundProduct.images?.[0] || foundProduct.image);
    } else {
      setError("Product not found");
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3 text-gray-500 font-semibold">
        <Loader2 className="w-8 h-8 animate-spin text-[#ff6840]" />
        <p className="text-sm">Loading dish details...</p>
      </div>
    );
  }

  // Not Found / Error State
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
        <h2 className="text-xl font-bold text-gray-800">Food Item Not Found</h2>
        <p className="text-xs text-gray-500 mt-1 max-w-sm">
          The dish you are looking for might have been removed or is temporarily unavailable.
        </p>
        <button
          onClick={() => navigate("/explore")}
          className="mt-5 px-6 py-2.5 bg-[#ff6840] text-white font-bold text-xs rounded-xl shadow hover:bg-[#e05530] transition-colors"
        >
          Explore Other Dishes
        </button>
      </div>
    );
  }

  const foodId = String(product._id || product.id || id);
  const favActive = isFavorite(foodId);

  // Normalize images array
  const imagesList =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [product.image || "https://via.placeholder.com/600"];

  // Restaurant/Shop title
  const shopName = product.shop?.name || product.restaurant || "SnackDrop Kitchen";

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-10 font-sans">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        {/* Navigation Breadcrumb / Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-500 hover:text-[#ff6840] mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to menu</span>
        </button>

        {/* Main Product Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* LEFT COLUMN: IMAGES */}
            <div className="flex flex-col gap-4">
              <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
                <img
                  src={selectedImage || imagesList[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />

                {/* Wishlist Button on Image */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-3.5 right-3.5 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md text-gray-400 hover:text-[#ff6840] transition-transform active:scale-90"
                  aria-label="Wishlist"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      favActive ? "fill-[#ff6840] text-[#ff6840]" : ""
                    }`}
                  />
                </button>

                {/* Trending Badge */}
                {product.isTrending && (
                  <span className="absolute top-3.5 left-3.5 px-3 py-1 bg-amber-500 text-white text-[10px] font-extrabold uppercase tracking-wider rounded-lg shadow-sm">
                    Trending
                  </span>
                )}
              </div>

              {/* Thumbnails list */}
              {imagesList.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                  {imagesList.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-18 h-18 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        selectedImage === img
                          ? "border-[#ff6840] ring-2 ring-[#ff6840]/20"
                          : "border-gray-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`thumbnail-${idx}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: DETAILS & ACTIONS */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Shop / Restaurant Tag */}
                <div className="flex items-center gap-2 text-xs font-semibold text-[#ff6840] mb-2">
                  <Store className="w-4 h-4 shrink-0" />
                  <span className="truncate">{shopName}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-500 capitalize">{product.category || "Food"}</span>
                </div>

                {/* Product Name */}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                  {product.name}
                </h1>

                {/* Rating & Delivery Badges */}
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-100 rounded-lg text-xs font-bold text-amber-700">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating ? Number(product.rating).toFixed(1) : "4.5"}</span>
                    <span className="text-amber-500 font-normal">
                      ({product.reviewCount || "100+"})
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-semibold text-gray-600">
                    <Clock className="w-3.5 h-3.5 text-gray-500" />
                    <span>{product.deliveryTime || "20–30 min"}</span>
                  </div>
                </div>

                {/* Price Section */}
                <div className="flex items-baseline gap-3 mt-5">
                  <span className="text-3xl font-extrabold text-[#ff6840]">
                    ₹{product.price}
                  </span>

                  {product.originalPrice > product.price && (
                    <span className="text-base font-semibold text-gray-400 line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}

                  {product.discount > 0 && (
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-bold rounded-md">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>

                {/* Short Description */}
                <p className="text-xs sm:text-sm text-gray-500 mt-4 leading-relaxed">
                  {product.description}
                </p>

                {/* Quantity Selector */}
                <div className="mt-6">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 w-fit rounded-xl p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-600 font-bold hover:bg-gray-100 transition shadow-xs active:scale-95"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-extrabold text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-600 font-bold hover:bg-gray-100 transition shadow-xs active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Add to Cart & Wishlist Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 py-3.5 px-6 bg-[#ff6840] hover:bg-[#e05530] text-white font-extrabold text-sm rounded-2xl shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  Add to Cart • ₹{(product.price * quantity).toFixed(0)}
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`flex items-center justify-center gap-2 px-5 py-3.5 border font-bold text-xs sm:text-sm rounded-2xl transition-all cursor-pointer ${
                    favActive
                      ? "border-[#ff6840] bg-orange-50/40 text-[#ff6840]"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${favActive ? "fill-[#ff6840]" : ""}`} />
                  <span>{favActive ? "Saved" : "Save"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Value Propositions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-10 pt-8 border-t border-gray-100">
            <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-2xl">
              <Truck className="w-5 h-5 text-[#ff6840] shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-900">Fast Delivery</p>
                <p className="text-[10px] text-gray-400">Doorstep drop-off in minutes</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-2xl">
              <ShieldCheck className="w-5 h-5 text-[#ff6840] shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-900">Hygienic Prep</p>
                <p className="text-[10px] text-gray-400">100% fresh kitchen standards</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-2xl">
              <RefreshCw className="w-5 h-5 text-[#ff6840] shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-900">Easy Support</p>
                <p className="text-[10px] text-gray-400">Quick refunds on damaged food</p>
              </div>
            </div>
          </div>

          {/* Details / Ingredients / Reviews Tabs */}
          <div className="mt-10">
            <div className="flex border-b border-gray-200">
              {["Description", "Ingredients", "Reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 sm:px-6 py-3 text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer ${
                    activeTab === tab
                      ? "text-[#ff6840] border-[#ff6840]"
                      : "text-gray-400 border-transparent hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="py-5 text-xs sm:text-sm text-gray-600 leading-relaxed min-h-20">
              {activeTab === "Description" && (
                <p>{product.longDescription || product.description}</p>
              )}

              {activeTab === "Ingredients" && (
                <p>{product.ingredients || "Prepared with fresh, handpicked local market ingredients."}</p>
              )}

              {activeTab === "Reviews" && (
                <p>{product.reviews || `Rated ⭐ ${product.rating || 4.5} out of 5 based on satisfied diners.`}</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}