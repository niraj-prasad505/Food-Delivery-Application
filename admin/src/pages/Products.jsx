import React, { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Search,
  Store,
  Edit2,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Flame,
  Tag,
  IndianRupee,
  Layers,
} from "lucide-react";
import {
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/adminProductService";
import { getMyShops } from "../services/adminShopService";

const FOOD_CATEGORIES = [
  "All",
  "Fast Food",
  "Main Course",
  "Pizza",
  "Burger",
  "Biryani",
  "Beverages",
  "Dessert",
  "Starters",
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedShopFilter, setSelectedShopFilter] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Form State
  const [formData, setFormData] = useState({
    shop: "",
    name: "",
    price: "",
    originalPrice: "",
    category: "Fast Food",
    cuisine: "General",
    description: "",
    deliveryTime: "20–30 min",
    stock: 50,
    imageUrl: "",
    isTrending: false,
  });

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: "", message: "" }), 3500);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, shopRes] = await Promise.all([
        getMyProducts(),
        getMyShops(),
      ]);

      if (prodRes.success) setProducts(prodRes.products || []);
      if (shopRes.success) setShops(shopRes.shops || []);
    } catch (err) {
      showFeedback("error", err.response?.data?.message || "Failed to load product catalog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (prod = null) => {
    if (prod) {
      setEditingProduct(prod);
      setFormData({
        shop: prod.shop?._id || prod.shop || "",
        name: prod.name || "",
        price: prod.price || "",
        originalPrice: prod.originalPrice || prod.price || "",
        category: prod.category || "Fast Food",
        cuisine: prod.cuisine || "General",
        description: prod.description || "",
        deliveryTime: prod.deliveryTime || "20–30 min",
        stock: prod.stock !== undefined ? prod.stock : 50,
        imageUrl: prod.images?.[0] || "",
        isTrending: Boolean(prod.isTrending),
      });
    } else {
      setEditingProduct(null);
      setFormData({
        shop: shops[0]?._id || "",
        name: "",
        price: "",
        originalPrice: "",
        category: "Fast Food",
        cuisine: "General",
        description: "",
        deliveryTime: "20–30 min",
        stock: 50,
        imageUrl: "",
        isTrending: false,
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.shop) {
      showFeedback("error", "Please register/select a shop branch first");
      return;
    }

    setActionLoading(true);
    const payload = {
      ...formData,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice || formData.price),
      stock: Number(formData.stock),
      images: formData.imageUrl ? [formData.imageUrl] : [],
    };

    try {
      if (editingProduct) {
        const res = await updateProduct(editingProduct._id, payload);
        if (res.success) {
          setProducts((prev) =>
            prev.map((p) => (p._id === editingProduct._id ? res.product : p))
          );
          showFeedback("success", "Product updated successfully");
          setModalOpen(false);
        }
      } else {
        const res = await createProduct(payload);
        if (res.success) {
          setProducts((prev) => [res.product, ...prev]);
          showFeedback("success", "Product created successfully");
          setModalOpen(false);
        }
      }
    } catch (err) {
      showFeedback("error", err.response?.data?.message || "Operation failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleTrending = async (prod) => {
    const updatedStatus = !prod.isTrending;
    try {
      const res = await updateProduct(prod._id, { isTrending: updatedStatus });
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === prod._id ? { ...p, isTrending: updatedStatus } : p))
        );
        showFeedback("success", `Trending set to ${updatedStatus ? "Active" : "Disabled"}`);
      }
    } catch (err) {
      showFeedback("error", "Could not update trending status");
    }
  };

  const handleDelete = async (prodId) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) return;

    try {
      const res = await deleteProduct(prodId);
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p._id !== prodId));
        showFeedback("success", "Item deleted from catalog");
      }
    } catch (err) {
      showFeedback("error", err.response?.data?.message || "Delete failed");
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchesShop =
      selectedShopFilter === "All" || (p.shop?._id || p.shop) === selectedShopFilter;
    return matchesSearch && matchesCat && matchesShop;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8 font-sans text-slate-900 space-y-6">
      {feedback.message && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-xs font-semibold shadow-lg backdrop-blur-md ${
            feedback.type === "success"
              ? "bg-emerald-50/90 border-emerald-200 text-emerald-800"
              : "bg-rose-50/90 border-rose-200 text-rose-800"
          }`}
        >
          {feedback.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Menu Items & Catalog
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage food listings, pricing, inventory stock, and highlighted items.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          disabled={shops.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-orange-500 active:scale-95 disabled:opacity-50"
        >
          <Plus size={18} />
          Add Food Item
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search items by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* Shop Selector Filter */}
        <select
          value={selectedShopFilter}
          onChange={(e) => setSelectedShopFilter(e.target.value)}
          className="px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none font-medium text-slate-700 focus:border-orange-500"
        >
          <option value="All">All Outlets</option>
          {shops.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name} ({s.city})
            </option>
          ))}
        </select>

        {/* Categories scrollable pill list */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {FOOD_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 text-xs font-semibold rounded-xl shrink-0 transition ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white"
                  : "bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex h-72 items-center justify-center">
          <Loader2 className="animate-spin text-slate-400" size={32} />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 mb-3">
            <Package size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-800">No food items found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            {shops.length === 0
              ? "You must register at least one outlet under 'Shops' before creating dishes."
              : "No dishes match your active filter."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p._id}
              className="group rounded-3xl border border-slate-200/80 bg-white p-4 shadow-xs transition hover:border-slate-300 hover:shadow-md flex flex-col justify-between"
            >
              <div>
                {/* Image Container with Badges */}
                <div className="relative h-44 w-full rounded-2xl bg-slate-100 overflow-hidden mb-3.5">
                  <img
                    src={p.images?.[0] || "https://placehold.co/400x300?text=Dish"}
                    alt={p.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  {p.discount > 0 && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-rose-600 text-white text-[10px] font-bold shadow-xs">
                      {p.discount}% OFF
                    </span>
                  )}
                  <button
                    onClick={() => handleToggleTrending(p)}
                    title="Toggle Trending"
                    className={`absolute top-2 right-2 p-1.5 rounded-xl backdrop-blur-md transition ${
                      p.isTrending
                        ? "bg-amber-500 text-white shadow-xs"
                        : "bg-black/30 text-white/70 hover:text-white"
                    }`}
                  >
                    <Flame size={15} />
                  </button>
                </div>

                {/* Outlet & Category tags */}
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
                  <span className="truncate flex items-center gap-1">
                    <Store size={12} /> {p.shop?.name || p.restaurant}
                  </span>
                  <span className="text-orange-600 font-bold">{p.category}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1">
                  {p.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                  {p.description}
                </p>
              </div>

              {/* Price, Stock & Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-extrabold text-slate-900">
                      ₹{p.price}
                    </span>
                    {p.originalPrice > p.price && (
                      <span className="text-xs text-slate-400 line-through">
                        ₹{p.originalPrice}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-semibold ${
                      p.stock > 10
                        ? "text-emerald-600"
                        : p.stock > 0
                        ? "text-amber-600"
                        : "text-rose-600"
                    }`}
                  >
                    {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenModal(p)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Drawer */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h2 className="text-lg font-bold text-slate-900">
                {editingProduct ? "Edit Product Details" : "New Food Item"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Shop selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Outlet Branch *
                </label>
                <select
                  required
                  value={formData.shop}
                  onChange={(e) => setFormData({ ...formData, shop: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none font-medium"
                >
                  <option value="" disabled>
                    Choose store...
                  </option>
                  {shops.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} - {s.city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Dish / Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gourmet Truffle Burger"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none font-medium"
                />
              </div>

              {/* Category & Cuisine */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none font-medium"
                  >
                    {FOOD_CATEGORIES.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Cuisine
                  </label>
                  <input
                    type="text"
                    placeholder="Italian, Continental, Indian"
                    value={formData.cuisine}
                    onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none font-medium"
                  />
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Sale Price (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="299"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="349"
                    value={formData.originalPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, originalPrice: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Units Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none font-medium"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Item Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none font-medium"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Description *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Fresh ingredients, house special seasoning..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none font-medium"
                />
              </div>

              {/* Trending Switch */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="trending"
                  checked={formData.isTrending}
                  onChange={(e) =>
                    setFormData({ ...formData, isTrending: e.target.checked })
                  }
                  className="h-4 w-4 rounded-sm border-slate-300 text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="trending" className="text-xs font-semibold text-slate-700">
                  Feature in "Trending Now" recommendations
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-orange-500 active:scale-95 disabled:opacity-50"
                >
                  {actionLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : editingProduct ? (
                    "Save Changes"
                  ) : (
                    "Create Listing"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}