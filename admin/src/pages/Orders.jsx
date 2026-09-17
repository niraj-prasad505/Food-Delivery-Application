import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Search,
  Store,
  Clock,
  MapPin,
  Phone,
  CreditCard,
  ChevronDown,
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  X,
  ArrowRight,
} from "lucide-react";
import {
  getMyOrders,
  updateOrderStatus,
  updatePaymentStatus,
} from "../services/adminOrderService";
import { getMyShops } from "../services/adminShopService";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  { value: "confirmed", label: "Confirmed", badge: "bg-sky-50 text-sky-700 border-sky-200" },
  { value: "preparing", label: "Preparing", badge: "bg-orange-50 text-orange-700 border-orange-200" },
  { value: "out_for_delivery", label: "Out for Delivery", badge: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { value: "delivered", label: "Delivered", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { value: "cancelled", label: "Cancelled", badge: "bg-rose-50 text-rose-700 border-rose-200" },
];

const TABS = [
  { key: "all", label: "All Orders" },
  { key: "pending", label: "Pending" },
  { key: "preparing", label: "Kitchen / Preparing" },
  { key: "out_for_delivery", label: "On The Way" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedShop, setSelectedShop] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: "", message: "" }), 3500);
  };

  const fetchOrdersData = async () => {
    try {
      setLoading(true);
      const [orderRes, shopRes] = await Promise.all([
        getMyOrders({ status: activeTab, shopId: selectedShop !== "all" ? selectedShop : undefined }),
        getMyShops(),
      ]);

      if (orderRes.success) setOrders(orderRes.orders || []);
      if (shopRes.success) setShops(shopRes.shops || []);
    } catch (err) {
      showFeedback("error", err.response?.data?.message || "Failed to fetch live orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersData();
  }, [activeTab, selectedShop]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await updateOrderStatus(orderId, newStatus);
      if (res.success && res.order) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? res.order : o))
        );
        if (selectedOrder?._id === orderId) {
          setSelectedOrder(res.order);
        }
        showFeedback("success", `Order updated to ${newStatus.replace(/_/g, " ")}`);
      }
    } catch (err) {
      showFeedback("error", err.response?.data?.message || "Status update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePaymentToggle = async (orderId, currentPayment) => {
    const nextStatus = currentPayment === "paid" ? "pending" : "paid";
    try {
      setUpdatingId(orderId);
      const res = await updatePaymentStatus(orderId, nextStatus);
      if (res.success && res.order) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, paymentStatus: nextStatus } : o))
        );
        if (selectedOrder?._id === orderId) {
          setSelectedOrder((prev) => ({ ...prev, paymentStatus: nextStatus }));
        }
        showFeedback("success", `Payment marked as ${nextStatus}`);
      }
    } catch (err) {
      showFeedback("error", "Payment status change failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const getBadgeStyle = (status) => {
    const found = STATUS_OPTIONS.find((s) => s.value === status?.toLowerCase());
    return found ? found.badge : "bg-slate-100 text-slate-700 border-slate-200";
  };

  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase();
    const matchesId = o._id.toLowerCase().includes(q);
    const matchesUser = o.user?.name?.toLowerCase().includes(q) || o.user?.phone?.includes(q);
    const matchesShop = o.shop?.name?.toLowerCase().includes(q);
    return matchesId || matchesUser || matchesShop;
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
            Order Fulfillment
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track customer requests, dispatch meals, and monitor live payment statuses.
          </p>
        </div>

        <button
          onClick={fetchOrdersData}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh Feed
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Status Nav Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl shrink-0 transition ${
                activeTab === tab.key
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search and Branch Filter */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by ID, customer, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 font-medium"
            />
          </div>

          <select
            value={selectedShop}
            onChange={(e) => setSelectedShop(e.target.value)}
            className="px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none font-semibold text-slate-700 focus:border-orange-500 shrink-0"
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

      {/* Orders Table Container */}
      <div className="rounded-3xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex h-72 items-center justify-center">
            <Loader2 className="animate-spin text-slate-400" size={32} />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 mb-3">
              <ShoppingBag size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-800">No active orders</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              No orders found under this category or search filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Customer Details</th>
                  <th className="py-3.5 px-4">Outlet</th>
                  <th className="py-3.5 px-4">Items / Total</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Progress Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-4 font-mono font-bold text-slate-800">
                      #{ord._id.slice(-6).toUpperCase()}
                      <div className="text-[10px] font-normal text-slate-400 font-sans">
                        {new Date(ord.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-900">{ord.user?.name || "Customer"}</div>
                      <div className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                        <Phone size={11} /> {ord.user?.phone || "No phone"}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-600">
                      <span className="font-medium text-slate-800">{ord.shop?.name}</span>
                      <div className="text-[11px] text-slate-400">{ord.shop?.city}</div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 text-sm">₹{ord.totalAmount}</div>
                      <div className="text-[11px] text-slate-500">
                        {ord.items.reduce((acc, item) => acc + item.quantity, 0)} item(s)
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handlePaymentToggle(ord._id, ord.paymentStatus)}
                          disabled={updatingId === ord._id}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition ${
                            ord.paymentStatus === "paid"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                          }`}
                        >
                          {ord.paymentStatus}
                        </button>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">
                          {ord.paymentMethod}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <select
                        value={ord.status}
                        disabled={updatingId === ord._id}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        className={`text-xs font-semibold py-1 px-2.5 rounded-xl border outline-none cursor-pointer ${getBadgeStyle(
                          ord.status
                        )}`}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Drawer Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono font-bold text-orange-600">
                  ORDER DETAILS
                </span>
                <h2 className="text-xl font-extrabold text-slate-900">
                  #{selectedOrder._id.toUpperCase()}
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Customer & Location */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-700">
                <span className="font-semibold text-slate-900">{selectedOrder.user?.name}</span>
                <span className="text-slate-500">{selectedOrder.user?.phone}</span>
              </div>
              <div className="flex items-start gap-1.5 text-slate-500 pt-1">
                <MapPin size={15} className="text-slate-400 shrink-0 mt-0.5" />
                <span>{selectedOrder.deliveryAddress}</span>
              </div>
            </div>

            {/* Order Items List */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                Ordered Meals
              </h4>
              <div className="divide-y divide-slate-100 border-y border-slate-100">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-md bg-orange-100 text-orange-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {item.quantity}x
                      </div>
                      <span className="font-semibold text-slate-800">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="pt-2 flex justify-between items-center text-sm font-bold border-t border-slate-100">
              <span className="text-slate-600">Total Bill Amount</span>
              <span className="text-lg text-slate-900 font-extrabold">₹{selectedOrder.totalAmount}</span>
            </div>

            {/* Quick Transition Buttons */}
            <div className="pt-4 border-t border-slate-100 flex gap-2">
              {selectedOrder.status === "pending" && (
                <button
                  onClick={() => handleStatusChange(selectedOrder._id, "confirmed")}
                  className="flex-1 py-2.5 rounded-xl bg-sky-600 text-white font-semibold text-xs hover:bg-sky-500"
                >
                  Accept & Confirm
                </button>
              )}
              {selectedOrder.status === "confirmed" && (
                <button
                  onClick={() => handleStatusChange(selectedOrder._id, "preparing")}
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 text-white font-semibold text-xs hover:bg-orange-500"
                >
                  Start Preparing
                </button>
              )}
              {selectedOrder.status === "preparing" && (
                <button
                  onClick={() => handleStatusChange(selectedOrder._id, "out_for_delivery")}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-500"
                >
                  Hand Over to Driver
                </button>
              )}
              {selectedOrder.status === "out_for_delivery" && (
                <button
                  onClick={() => handleStatusChange(selectedOrder._id, "delivered")}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-500"
                >
                  Mark Delivered
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}