import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Heart, ArrowLeft, Plus, Minus, Truck, ShieldCheck, RefreshCw } from "lucide-react";

// Centralized Data Source
import { foodsData } from "../data/foodsData";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Description");
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    // 1. Check centralized dataset first
    const foundProduct = foodsData.find((item) => String(item.id) === String(id));

    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedImage(foundProduct.image || foundProduct.images?.[0]);
    } else {
      // 2. Fallback to API call or dynamic fallback generation
      fetch(`http://localhost:5000/api/foods/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.product) {
            setProduct(data.product);
            setSelectedImage(data.product.images?.[0] || data.product.image);
          } else {
            createFallbackProduct(id);
          }
        })
        .catch(() => {
          createFallbackProduct(id);
        });
    }
  }, [id]);

  const createFallbackProduct = (productId) => {
    const fallback = {
      id: productId,
      name: "Delicious Gourmet Dish",
      rating: 4.5,
      reviewsCount: "500+",
      price: 199,
      originalPrice: 249,
      discount: "20% OFF",
      description: "Made fresh on order with high quality ingredients by top local chefs.",
      longDescription: "Experience delicious taste with authentic flavors, packed with care and delivered fast through SnackDrop.",
      images: [
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80"
      ],
      ingredients: "Fresh Herbs, Signature Spices, Premium Veggies/Proteins.",
      reviews: "⭐ 4.5 rating based on customer feedback."
    };
    setProduct(fallback);
    setSelectedImage(fallback.images[0]);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500 font-semibold">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans">
      <main className="max-w-5xl mx-auto px-4 py-8 w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#ff6840] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Product Details Main Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column: Image Preview & Thumbnails */}
            <div>
              <div className="relative w-full h-72 md:h-80 rounded-2xl overflow-hidden bg-gray-100 mb-4 border border-gray-100">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                </button>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto pb-1">
                {(product.images || [selectedImage]).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === img ? "border-[#ff6840]" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Title, Ratings, Pricing, Quantity & CTA */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">{product.name}</h1>
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="text-gray-400 hover:text-red-500 transition-colors md:hidden"
                  >
                    <Heart className={`w-6 h-6 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                  </button>
                </div>

                {/* Ratings */}
                <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 mt-2">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-gray-900 font-bold">{product.rating}</span>
                  <span className="text-gray-400">({product.reviewsCount} reviews)</span>
                </div>

                {/* Price Section */}
                <div className="flex items-center gap-3 mt-4">
                  <span className="text-2xl md:text-3xl font-extrabold text-[#ff6840]">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-base font-semibold text-gray-400 line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                  {product.discount && (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg">
                      {product.discount}
                    </span>
                  )}
                </div>

                <p className="text-xs md:text-sm text-gray-500 mt-4 leading-relaxed">
                  {product.description}
                </p>

                {/* Quantity Control */}
                <div className="mt-6">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3 bg-gray-100 w-fit rounded-xl p-1 border border-gray-200">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-600 font-bold hover:bg-gray-200 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-extrabold text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-600 font-bold hover:bg-gray-200 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => alert(`Added ${quantity} x ${product.name} to SnackDrop cart!`)}
                  className="flex-1 py-3.5 bg-[#ff6840] hover:bg-[#e05530] text-white font-extrabold text-sm rounded-2xl shadow-md transition-all active:scale-95"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="flex items-center gap-2 px-5 py-3.5 border border-red-200 text-red-500 hover:bg-red-50 font-bold text-sm rounded-2xl transition-all"
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500" : ""}`} />
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>

          {/* Features Highlights Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 pt-8 border-t border-gray-100 text-center">
            <div className="flex items-center justify-center gap-3 p-3 bg-gray-50 rounded-2xl">
              <Truck className="w-5 h-5 text-[#ff6840]" />
              <div className="text-left">
                <p className="text-xs font-bold text-gray-900">30 mins Delivery</p>
                <p className="text-[10px] text-gray-400">Superfast doorstep delivery</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 p-3 bg-gray-50 rounded-2xl">
              <ShieldCheck className="w-5 h-5 text-[#ff6840]" />
              <div className="text-left">
                <p className="text-xs font-bold text-gray-900">Best Quality</p>
                <p className="text-[10px] text-gray-400">Fresh local ingredients</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 p-3 bg-gray-50 rounded-2xl">
              <RefreshCw className="w-5 h-5 text-[#ff6840]" />
              <div className="text-left">
                <p className="text-xs font-bold text-gray-900">Easy Returns</p>
                <p className="text-[10px] text-gray-400">Not satisfied? instant replacement</p>
              </div>
            </div>
          </div>

          {/* Description / Ingredients / Reviews Tabs */}
          <div className="mt-10">
            <div className="flex border-b border-gray-200">
              {["Description", "Ingredients", "Reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-xs md:text-sm font-bold transition-all ${
                    activeTab === tab
                      ? "text-[#ff6840] border-b-2 border-[#ff6840]"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="py-6 text-xs md:text-sm text-gray-600 leading-relaxed">
              {activeTab === "Description" && <p>{product.longDescription || product.description}</p>}
              {activeTab === "Ingredients" && <p>{product.ingredients}</p>}
              {activeTab === "Reviews" && <p>{product.reviews}</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}