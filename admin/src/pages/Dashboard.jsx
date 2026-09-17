import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Store,
  PackageCheck,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Percent,
  Megaphone,
  PlusCircle,
  Sparkles,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { getAdminDashboard } from "../services/adminDashboardService";

const QUICK_ACTIONS = [
  {
    title: "Add New Shop",
    desc: "Register a vendor branch",
    icon: Store,
    iconColor: "text-rose-600",
    bgHover: "hover:border-rose-300 hover:bg-rose-50/50",
    path: "/shops",
  },
  {
    title: "Add Product",
    desc: "Create new food listing",
    icon: PlusCircle,
    iconColor: "text-amber-600",
    bgHover: "hover:border-amber-300 hover:bg-amber-50/50",
    path: "/products",
  },
  {
    title: "Create Offer",
    desc: "Discounts & coupons",
    icon: Percent,
    iconColor: "text-emerald-600",
    bgHover: "hover:border-emerald-300 hover:bg-emerald-50/50",
    path: "/settings",
  },
  {
    title: "Manage Reviews",
    desc: "Customer ratings & feedback",
    icon: Megaphone,
    iconColor: "text-indigo-600",
    bgHover: "hover:border-indigo-300 hover:bg-indigo-50/50",
    path: "/reviews",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch dashboard stats from backend
  const loadDashboardData = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      const res = await getAdminDashboard();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Dashboard API fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getStatusBadge = (status = "") => {
    const s = status.toLowerCase();
    if (s.includes("deliver") || s.includes("active")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
    }
    if (s.includes("prepar") || s.includes("pending")) {
      return "bg-amber-50 text-amber-700 border-amber-200/60";
    }
    if (s.includes("confirm")) {
      return "bg-sky-50 text-sky-700 border-sky-200/60";
    }
    if (s.includes("cancel") || s.includes("inactive")) {
      return "bg-rose-50 text-rose-700 border-rose-200/60";
    }
    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  // Convert ordersOverview data points into dynamic SVG coordinates
  const calculateChartGeometry = (overview = []) => {
    if (!overview || overview.length === 0) return { pathD: "", areaD: "", points: [] };

    const maxVal = Math.max(...overview.map((d) => d.value), 5);
    const chartHeight = 140; // plotting area height
    const baseY = 190; // Y bottom axis line
    const startX = 50;
    const endX = 650;
    const stepX = overview.length > 1 ? (endX - startX) / (overview.length - 1) : 0;

    const points = overview.map((item, idx) => {
      const x = startX + idx * stepX;
      const y = baseY - (item.value / maxVal) * chartHeight;
      return { x, y, value: item.value, label: item.label };
    });

    // Generate path command
    const lineCommands = points
      .map((pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `L ${pt.x} ${pt.y}`))
      .join(" ");

    const areaCommands = `${lineCommands} L ${points[points.length - 1].x} ${baseY} L ${points[0].x} ${baseY} Z`;

    return { pathD: lineCommands, areaD: areaCommands, points };
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-slate-400" size={36} />
        <p className="text-sm font-medium text-slate-500">Loading metrics...</p>
      </div>
    );
  }

  const chartGeometry = calculateChartGeometry(data?.ordersOverview);

  const statsList = [
    {
      id: "orders",
      title: "Total Orders",
      value: data?.stats?.orders?.value ?? 0,
      change: data?.stats?.orders?.change ?? "+0%",
      isPositive: data?.stats?.orders?.isPositive ?? true,
      subText: "vs last week",
      icon: ShoppingBag,
      bgColor: "bg-rose-50 text-rose-600",
      path: "/orders",
    },
    {
      id: "shops",
      title: "Active Shops",
      value: data?.stats?.shops?.value ?? 0,
      change: data?.stats?.shops?.change ?? "+0%",
      isPositive: data?.stats?.shops?.isPositive ?? true,
      subText: "registered stores",
      icon: Store,
      bgColor: "bg-amber-50 text-amber-600",
      path: "/shops",
    },
    {
      id: "products",
      title: "Total Products",
      value: data?.stats?.products?.value ?? 0,
      change: data?.stats?.products?.change ?? "+0%",
      isPositive: data?.stats?.products?.isPositive ?? true,
      subText: "catalogue items",
      icon: PackageCheck,
      bgColor: "bg-emerald-50 text-emerald-600",
      path: "/products",
    },
    {
      id: "revenue",
      title: "Total Revenue",
      value: data?.stats?.revenue?.value ?? "₹0",
      change: data?.stats?.revenue?.change ?? "+0%",
      isPositive: data?.stats?.revenue?.isPositive ?? true,
      subText: "gross earnings",
      icon: IndianRupee,
      bgColor: "bg-blue-50 text-blue-600",
      path: "/revenue",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8 space-y-8 font-sans text-slate-900">
      {/* ================= HEADER ================= */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Overview Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time shop metrics and business activity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadDashboardData(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
            Sync
          </button>
          <button
            onClick={() => navigate("/products")}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-slate-800 active:scale-95"
          >
            <Sparkles size={16} className="text-amber-400" />
            Quick Add
          </button>
        </div>
      </header>

      {/* ================= STATS GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {statsList.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => navigate(item.path)}
              className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <span className="text-sm font-medium text-slate-500">{item.title}</span>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.bgColor}`}>
                  <Icon size={22} strokeWidth={2.2} />
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  {item.value}
                </h3>
                <div className="mt-2 flex items-center gap-2 text-xs font-medium">
                  <span
                    className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-semibold ${
                      item.isPositive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {item.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {item.change}
                  </span>
                  <span className="text-slate-400">{item.subText}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= CHART + QUICK ACTIONS ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Dynamic Orders Trend Chart */}
        <div className="xl:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Orders & Demand Flow</h2>
              <p className="text-xs text-slate-500">Live order activity over the last 7 days</p>
            </div>
            <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              Last 7 Days
            </span>
          </div>

          <div className="h-64 w-full">
            <svg viewBox="0 0 700 240" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="orderFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {[40, 90, 140, 190].map((y) => (
                <line
                  key={y}
                  x1="30"
                  y1={y}
                  x2="670"
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
              ))}

              {chartGeometry.areaD && (
                <path d={chartGeometry.areaD} fill="url(#orderFill)" />
              )}

              {chartGeometry.pathD && (
                <path
                  d={chartGeometry.pathD}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {chartGeometry.points.map((pt, idx) => (
                <g key={idx} className="group cursor-pointer">
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5"
                    fill="#ffffff"
                    stroke="#ef4444"
                    strokeWidth="3"
                    className="transition group-hover:scale-150 group-hover:stroke-slate-900"
                  />
                  {/* Tooltip bubble on hover */}
                  <text
                    x={pt.x}
                    y={pt.y - 12}
                    textAnchor="middle"
                    className="text-[11px] font-bold fill-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {pt.value} orders
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="flex justify-between text-xs font-semibold text-slate-400 px-4 pt-2">
            {data?.ordersOverview?.map((item, idx) => (
              <span key={idx}>{item.label}</span>
            ))}
          </div>
        </div>

        {/* Quick Administrative Actions */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
            <p className="text-xs text-slate-500 mb-4">Store management shortcuts</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {QUICK_ACTIONS.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={() => navigate(action.path)}
                    className={`flex flex-col items-start p-4 rounded-xl border border-slate-200/80 bg-white text-left transition duration-150 ${action.bgHover} active:scale-98`}
                  >
                    <div className={`p-2.5 rounded-lg bg-slate-50 shadow-2xs mb-3 ${action.iconColor}`}>
                      <Icon size={20} strokeWidth={2.2} />
                    </div>
                    <span className="font-semibold text-sm text-slate-800">{action.title}</span>
                    <span className="text-xs text-slate-400 mt-0.5">{action.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-slate-900 p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">Settings & Logs</p>
                <h4 className="text-sm font-semibold mt-0.5">Admin Controls</h4>
              </div>
              <button
                onClick={() => navigate("/settings")}
                className="text-xs font-semibold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition"
              >
                Configure
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= DATA TABLES ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Orders Table */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>
              <p className="text-xs text-slate-500">Live feed from all owned shops</p>
            </div>
            <button
              onClick={() => navigate("/orders")}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition"
            >
              View all →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Shop</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.recentOrders?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-xs text-slate-400">
                      No customer orders recorded yet.
                    </td>
                  </tr>
                ) : (
                  data?.recentOrders?.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => navigate("/orders")}
                      className="hover:bg-slate-50/70 transition cursor-pointer"
                    >
                      <td className="py-3.5 font-semibold text-slate-800">{order.id}</td>
                      <td className="py-3.5 font-medium text-slate-700">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                            {order.customer.charAt(0).toUpperCase()}
                          </div>
                          {order.customer}
                        </div>
                      </td>
                      <td className="py-3.5 text-slate-500 text-xs">{order.shop}</td>
                      <td className="py-3.5 font-semibold text-slate-800">{order.amount}</td>
                      <td className="py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <button className="p-1 rounded-md text-slate-400 hover:text-slate-600">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products Table */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Top Products</h2>
              <p className="text-xs text-slate-500">Highest grossing food items</p>
            </div>
            <button
              onClick={() => navigate("/products")}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition"
            >
              View all →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3">#</th>
                  <th className="pb-3">Product Name</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Orders</th>
                  <th className="pb-3">Revenue</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.topProducts?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-xs text-slate-400">
                      No products added to catalogue yet.
                    </td>
                  </tr>
                ) : (
                  data?.topProducts?.map((product) => (
                    <tr
                      key={product.id}
                      onClick={() => navigate("/products")}
                      className="hover:bg-slate-50/70 transition cursor-pointer"
                    >
                      <td className="py-3.5 text-xs text-slate-400 font-medium">0{product.id}</td>
                      <td className="py-3.5 font-semibold text-slate-800">{product.name}</td>
                      <td className="py-3.5 text-xs text-slate-500">{product.category}</td>
                      <td className="py-3.5 text-slate-600">{product.orders}</td>
                      <td className="py-3.5 font-semibold text-slate-800">{product.revenue}</td>
                      <td className="py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                            product.status
                          )}`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {product.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}