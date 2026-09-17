import React, { useState, useEffect } from "react";
import {
  Star,
  MessageSquare,
  Search,
  Store,
  Trash2,
  Filter,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  TrendingUp,
  Package,
} from "lucide-react";
import { getMyReviews, deleteReview } from "../services/adminReviewService";
import { getMyShops } from "../services/adminShopService";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedShop, setSelectedShop] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: "", message: "" }), 3500);
  };

  const loadReviewsData = async () => {
    try {
      setLoading(true);
      const [revRes, shopRes] = await Promise.all([
        getMyReviews({
          rating: selectedRating !== "all" ? selectedRating : undefined,
          shopId: selectedShop !== "all" ? selectedShop : undefined,
        }),
        getMyShops(),
      ]);

      if (revRes.success) {
        setReviews(revRes.reviews || []);
        setStats(
          revRes.stats || {
            averageRating: 0,
            totalReviews: 0,
            breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
          }
        );
      }
      if (shopRes.success) setShops(shopRes.shops || []);
    } catch (err) {
      showFeedback("error", err.response?.data?.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviewsData();
  }, [selectedRating, selectedShop]);

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Remove this customer review from your store?")) return;

    try {
      setDeletingId(reviewId);
      const res = await deleteReview(reviewId);
      if (res.success) {
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
        showFeedback("success", "Review removed successfully");
      }
    } catch (err) {
      showFeedback("error", err.response?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchesUser = r.user?.name?.toLowerCase().includes(q);
    const matchesComment = r.comment?.toLowerCase().includes(q);
    const matchesProduct = r.product?.name?.toLowerCase().includes(q);
    const matchesShop = r.shop?.name?.toLowerCase().includes(q);
    return matchesUser || matchesComment || matchesProduct || matchesShop;
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
            Ratings & Feedback
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Customer reviews, ratings distribution, and product satisfaction logs.
          </p>
        </div>

        <button
          onClick={loadReviewsData}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Sync Reviews
        </button>
      </div>

      {/* ================= RATINGS OVERVIEW CARD ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Average Score Box */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Store Rating
            </span>
            <div className="flex items-baseline gap-3 mt-3">
              <h2 className="text-5xl font-black text-slate-900">
                {stats.averageRating}
              </h2>
              <div className="flex flex-col">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={17}
                      className={
                        i < Math.round(stats.averageRating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-200"
                      }
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-slate-400 mt-1">
                  Based on {stats.totalReviews} total ratings
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <TrendingUp size={15} className="text-emerald-500" />
              Customer Sentiment
            </span>
            <span className="font-semibold text-slate-800">
              {stats.averageRating >= 4 ? "Highly Recommended" : "Needs Attention"}
            </span>
          </div>
        </div>

        {/* Rating Star Distribution Bar Chart */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Star Distribution
          </span>

          <div className="space-y-2.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.breakdown?.[star] || 0;
              const percent = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3 text-xs">
                  <span className="w-12 font-bold text-slate-700 flex items-center gap-1 shrink-0">
                    {star} <Star size={12} className="fill-amber-400 text-amber-400" />
                  </span>

                  <div className="h-2.5 flex-1 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <span className="w-12 text-right font-medium text-slate-400 text-[11px] shrink-0">
                    {count} ({Math.round(percent)}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= FILTER TOOLBAR ================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search reviews by dish, customer, or words..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Star Filter */}
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl outline-none font-semibold text-slate-700 focus:border-orange-500"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars Only</option>
            <option value="4">4 Stars Only</option>
            <option value="3">3 Stars Only</option>
            <option value="2">2 Stars Only</option>
            <option value="1">1 Star Only</option>
          </select>

          {/* Shop Branch Filter */}
          <select
            value={selectedShop}
            onChange={(e) => setSelectedShop(e.target.value)}
            className="px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl outline-none font-semibold text-slate-700 focus:border-orange-500"
          >
            <option value="all">All Outlets</option>
            {shops.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ================= REVIEWS FEED GRID ================= */}
      {loading ? (
        <div className="flex h-72 items-center justify-center">
          <Loader2 className="animate-spin text-slate-400" size={32} />
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 mb-3">
            <MessageSquare size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-800">No reviews found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Customer feedback on your dishes and store orders will show up here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev._id}
              className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-slate-300 hover:shadow-md flex flex-col justify-between"
            >
              <div>
                {/* Header: User avatar & Rating */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700 text-xs uppercase">
                      {rev.user?.name ? rev.user.name.charAt(0) : "C"}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 leading-tight">
                        {rev.user?.name || "Verified Customer"}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-normal">
                        {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 px-2 py-1 rounded-lg bg-amber-50 border border-amber-200/60 text-amber-700 text-xs font-bold">
                    <span>{rev.rating}</span>
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                  </div>
                </div>

                {/* Comment Text */}
                <p className="text-xs text-slate-600 leading-relaxed min-h-12 italic">
                  "{rev.comment || "Customer did not leave written comments."}"
                </p>

                {/* Product / Dish Attached Tag */}
                {rev.product && (
                  <div className="mt-3.5 flex items-center gap-2 rounded-xl bg-slate-50 p-2 border border-slate-100">
                    <img
                      src={rev.product.images?.[0] || "https://placehold.co/100x100?text=Food"}
                      alt={rev.product.name}
                      className="h-9 w-9 rounded-lg object-cover"
                    />
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {rev.product.name}
                      </p>
                      <span className="text-[10px] text-orange-600 font-semibold">
                        {rev.product.category}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer: Outlet context & moderation button */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 truncate max-w-[70%]">
                  <Store size={13} className="shrink-0" />
                  {rev.shop?.name}
                </span>

                <button
                  onClick={() => handleDelete(rev._id)}
                  disabled={deletingId === rev._id}
                  title="Remove review"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition active:scale-95 disabled:opacity-50"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}