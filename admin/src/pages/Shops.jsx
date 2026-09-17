import React, { useState, useEffect } from "react";
import {
  Store,
  Plus,
  Search,
  MapPin,
  Phone,
  Clock,
  Radio,
  Edit2,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import {
  getMyShops,
  createShop,
  updateShop,
  deleteShop,
} from "../services/adminShopService";

export default function Shops() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingShop, setEditingShop] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    phone: "",
    address: "",
    city: "",
    deliveryRadiusKm: 10,
    icon: "",
    images: [],
  });

  // Load shops on mount
  const fetchShops = async () => {
    try {
      setLoading(true);
      const res = await getMyShops();
      if (res.success) {
        setShops(res.shops || []);
      }
    } catch (err) {
      showFeedback("error", err.response?.data?.message || "Failed to load shops");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: "", message: "" }), 4000);
  };

  // Open Modal for Create or Edit
  const handleOpenModal = (shop = null) => {
    if (shop) {
      setEditingShop(shop);
      setFormData({
        name: shop.name || "",
        description: shop.description || "",
        phone: shop.phone || "",
        address: shop.address || "",
        city: shop.city || "",
        deliveryRadiusKm: shop.deliveryRadiusKm || 10,
        icon: shop.icon || "",
        images: shop.images || [],
      });
    } else {
      setEditingShop(null);
      setFormData({
        name: "",
        description: "",
        phone: "",
        address: "",
        city: "",
        deliveryRadiusKm: 10,
        icon: "",
        images: [],
      });
    }
    setModalOpen(true);
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      if (editingShop) {
        const res = await updateShop(editingShop._id, formData);
        if (res.success && res.shop) {
          setShops((prev) =>
            prev.map((s) => (s._id === editingShop._id ? res.shop : s))
          );
          showFeedback("success", "Outlet updated successfully");
          setModalOpen(false);
        }
      } else {
        const res = await createShop(formData);
        if (res.success && res.shop) {
          setShops((prev) => [res.shop, ...prev]);
          showFeedback("success", "New outlet registered successfully");
          setModalOpen(false);
        }
      }
    } catch (err) {
      showFeedback("error", err.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };
  // Quick Toggle Open/Closed
  const handleToggleOpen = async (shop) => {
    const targetState = !shop.isOpen;

    // Optimistic UI update
    setShops((prev) =>
      prev.map((s) => (s._id === shop._id ? { ...s, isOpen: targetState } : s))
    );

    try {
      const res = await updateShop(shop._id, { isOpen: targetState });
      if (res.success && res.shop) {
        setShops((prev) =>
          prev.map((s) => (s._id === shop._id ? res.shop : s))
        );
        showFeedback("success", `${shop.name} is now ${targetState ? "Open" : "Closed"}`);
      }
    } catch (err) {
      // Revert switch on failure
      setShops((prev) =>
        prev.map((s) => (s._id === shop._id ? { ...s, isOpen: !targetState } : s))
      );
      showFeedback("error", err.response?.data?.message || "Could not toggle store status");
    }
  };

  // Delete Handler
  const handleDelete = async (shopId) => {
    if (!window.confirm("Are you sure you want to deactivate and remove this outlet?")) {
      return;
    }

    try {
      const res = await deleteShop(shopId);
      if (res.success) {
        setShops((prev) => prev.filter((s) => s._id !== shopId));
        showFeedback("success", "Shop removed successfully");
      }
    } catch (err) {
      showFeedback("error", err.response?.data?.message || "Failed to delete shop");
    }
  };

  // Filtered Shops
  const filteredShops = shops.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8 font-sans text-slate-900 space-y-6">
      {/* Feedback Banner */}
      {feedback.message && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-xs font-semibold shadow-lg backdrop-blur-md animate-in fade-in-0 duration-200 ${
            feedback.type === "success"
              ? "bg-emerald-50/90 border-emerald-200 text-emerald-800"
              : "bg-rose-50/90 border-rose-200 text-rose-800"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 size={16} className="shrink-0" />
          ) : (
            <AlertCircle size={16} className="shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Outlet Branches
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage store profiles, operating statuses, and delivery service zones.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-orange-500 active:scale-95"
        >
          <Plus size={18} />
          Register Outlet
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search outlets by name or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 placeholder:text-slate-400 font-medium transition"
          />
        </div>
      </div>

      {/* ================= OUTLETS GRID ================= */}
      {loading ? (
        <div className="flex h-72 items-center justify-center">
          <Loader2 className="animate-spin text-slate-400" size={32} />
        </div>
      ) : filteredShops.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 mb-3">
            <Store size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-800">No outlets registered</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            {searchQuery
              ? "No branches match your search query."
              : "Register your first store branch to start receiving food delivery orders."}
          </p>
          {!searchQuery && (
            <button
              onClick={() => handleOpenModal()}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              <Plus size={15} /> Add First Shop
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredShops.map((shop) => (
            <div
              key={shop._id}
              className="group relative rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition hover:border-slate-300 hover:shadow-md flex flex-col justify-between"
            >
              <div>
                {/* Card Top: Avatar & Action Buttons */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 font-bold overflow-hidden border border-slate-100">
                      {shop.icon ? (
                        <img
                          src={shop.icon}
                          alt={shop.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Store size={22} className="text-orange-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900 leading-tight">
                        {shop.name}
                      </h3>
                      <span className="text-xs font-medium text-slate-400">
                        {shop.city}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenModal(shop)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                      title="Edit Shop"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(shop._id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Remove Shop"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Description */}
                {shop.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                    {shop.description}
                  </p>
                )}

                {/* Details List */}
                <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-slate-400 shrink-0" />
                    <span className="truncate">{shop.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-slate-400 shrink-0" />
                    <span>{shop.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Radio size={14} className="text-slate-400 shrink-0" />
                    <span>Radius: {shop.deliveryRadiusKm || 10} km</span>
                  </div>
                </div>
              </div>

              {/* Status Toggle Area */}
              <div className="mt-5 pt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      shop.isOpen ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  />
                  <span className="text-xs font-semibold text-slate-700">
                    {shop.isOpen ? "Open for Orders" : "Closed"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleOpen(shop)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    shop.isOpen ? "bg-emerald-500" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      shop.isOpen ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= CREATE / EDIT MODAL ================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in-0 zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h2 className="text-lg font-bold text-slate-900">
                {editingShop ? "Edit Outlet" : "Register New Outlet"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Store Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pizza Corner - Central"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Contact *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kolkata"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Physical Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Street 14, City Center Block B"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Delivery Radius (km)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.deliveryRadiusKm}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        deliveryRadiusKm: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Logo / Icon Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Description / Tagline
                </label>
                <textarea
                  rows={2}
                  placeholder="Authentic woodfired pizzas, beverages, and desserts..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 font-medium"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-orange-500 transition active:scale-95 disabled:opacity-50"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Saving...
                    </>
                  ) : editingShop ? (
                    "Update Outlet"
                  ) : (
                    "Register Outlet"
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