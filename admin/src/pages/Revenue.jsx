import React, { useState, useEffect } from "react";
import {
  IndianRupee,
  TrendingUp,
  Wallet,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Building2,
  Calendar,
  Download,
  Loader2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Receipt,
  FileSpreadsheet,
} from "lucide-react";
import { getMyRevenueAnalytics } from "../services/adminRevenueService";
import { getMyShops } from "../services/adminShopService";

export default function Revenue() {
  const [data, setData] = useState(null);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("7d");
  const [selectedShop, setSelectedShop] = useState("all");
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: "", message: "" }), 3500);
  };

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const [revRes, shopRes] = await Promise.all([
        getMyRevenueAnalytics({
          timeframe,
          shopId: selectedShop !== "all" ? selectedShop : undefined,
        }),
        getMyShops(),
      ]);

      if (revRes.success) setData(revRes);
      if (shopRes.success) setShops(shopRes.shops || []);
    } catch (err) {
      showFeedback("error", err.response?.data?.message || "Failed to load financial data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, [timeframe, selectedShop]);

  // Dynamic SVG Area Chart Geometry
  const calculateChartGeometry = (chartData = []) => {
    if (!chartData || chartData.length === 0) return { pathD: "", areaD: "", points: [] };

    const maxVal = Math.max(...chartData.map((d) => d.revenue), 1000);
    const chartHeight = 140;
    const baseY = 190;
    const startX = 40;
    const endX = 660;
    const stepX = chartData.length > 1 ? (endX - startX) / (chartData.length - 1) : 0;

    const points = chartData.map((item, idx) => {
      const x = startX + idx * stepX;
      const y = baseY - (item.revenue / maxVal) * chartHeight;
      return { x, y, revenue: item.revenue, date: item.date };
    });

    const lineCommands = points
      .map((pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `L ${pt.x} ${pt.y}`))
      .join(" ");

    const areaCommands = `${lineCommands} L ${points[points.length - 1].x} ${baseY} L ${points[0].x} ${baseY} Z`;

    return { pathD: lineCommands, areaD: areaCommands, points };
  };

  const chartGeometry = calculateChartGeometry(data?.chartData);

  // CSV Export
  const handleExportCSV = () => {
    if (!data?.transactions || data.transactions.length === 0) {
      showFeedback("error", "No transaction records to export");
      return;
    }

    const headers = ["Transaction ID,Date,Customer,Outlet,Method,Status,Amount\n"];
    const rows = data.transactions.map(
      (t) =>
        `"${t.id}","${t.date}","${t.customer}","${t.shopName}","${t.paymentMethod.toUpperCase()}","${t.paymentStatus}","${t.rawAmount}"\n`
    );

    const blob = new Blob([...headers, ...rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `SnackDrop-Settlements-${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statCards = [
    {
      title: "Total Gross Revenue",
      value: data?.stats?.totalRevenue || "₹0",
      subText: "All completed orders",
      icon: IndianRupee,
      bgColor: "bg-blue-50 text-blue-600",
    },
    {
      title: "Settled / Realized",
      value: data?.stats?.realizedEarnings || "₹0",
      subText: "Successfully cleared payments",
      icon: Wallet,
      bgColor: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Pending Settlement",
      value: data?.stats?.pendingSettlement || "₹0",
      subText: "COD / unconfirmed receipts",
      icon: Clock,
      bgColor: "bg-amber-50 text-amber-600",
    },
    {
      title: "Average Order Value",
      value: data?.stats?.avgOrderValue || "₹0",
      subText: `From ${data?.stats?.totalOrdersCount || 0} customer orders`,
      icon: TrendingUp,
      bgColor: "bg-indigo-50 text-indigo-600",
    },
  ];

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

      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Financial & Settlements
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track business earnings, payment clearances, and transaction ledger.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchRevenueData}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Sync
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 active:scale-95 transition"
          >
            <FileSpreadsheet size={15} className="text-emerald-400" />
            Export CSV
          </button>
        </div>
      </div>

      {/* ================= STATS CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-slate-300"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold text-slate-500">{card.title}</span>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bgColor}`}>
                  <Icon size={20} strokeWidth={2.2} />
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  {card.value}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5">{card.subText}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= CHART & PAYMENT SHARE ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Earnings Flow Chart */}
        <div className="xl:col-span-2 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Revenue Flow</h2>
              <p className="text-xs text-slate-500">Gross revenue generated across daily orders</p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedShop}
                onChange={(e) => setSelectedShop(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-700"
              >
                <option value="all">All Outlets</option>
                {shops.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <div className="flex rounded-xl bg-slate-100 p-1">
                {["7d", "30d"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeframe(t)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                      timeframe === t ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {t === "7d" ? "7 Days" : "30 Days"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="animate-spin text-slate-400" size={28} />
              </div>
            ) : data?.chartData?.length === 0 ? (
              <div className="flex h-full items-center justify-center text-xs text-slate-400">
                No revenue records during this timeframe.
              </div>
            ) : (
              <svg viewBox="0 0 700 240" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {[40, 90, 140, 190].map((y) => (
                  <line
                    key={y}
                    x1="20"
                    y1={y}
                    x2="680"
                    y2={y}
                    stroke="#f1f5f9"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                ))}

                {chartGeometry.areaD && (
                  <path d={chartGeometry.areaD} fill="url(#revGradient)" />
                )}

                {chartGeometry.pathD && (
                  <path
                    d={chartGeometry.pathD}
                    fill="none"
                    stroke="#2563eb"
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
                      r="4.5"
                      fill="#ffffff"
                      stroke="#2563eb"
                      strokeWidth="3"
                      className="transition group-hover:scale-150"
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 10}
                      textAnchor="middle"
                      className="text-[10px] font-bold fill-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ₹{pt.revenue}
                    </text>
                  </g>
                ))}
              </svg>
            )}
          </div>

          <div className="flex justify-between text-xs font-semibold text-slate-400 px-3 pt-2">
            {data?.chartData?.map((item, idx) => (
              <span key={idx}>{item.date}</span>
            ))}
          </div>
        </div>

        {/* Payment Channels Split */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Payment Channels</h2>
            <p className="text-xs text-slate-500 mb-5">Share of settled payment methods</p>

            <div className="space-y-4">
              {/* Online */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 font-semibold text-slate-800">
                    <CreditCard size={16} className="text-blue-600" />
                    Online Gateway
                  </div>
                  <span className="font-bold text-slate-900">
                    ₹{data?.paymentMethodBreakdown?.online?.toLocaleString("en-IN") || 0}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 mt-3 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{
                      width: `${
                        data?.paymentMethodBreakdown
                          ? (data.paymentMethodBreakdown.online /
                              (data.paymentMethodBreakdown.online +
                                data.paymentMethodBreakdown.cod || 1)) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Cash On Delivery */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 font-semibold text-slate-800">
                    <IndianRupee size={16} className="text-emerald-600" />
                    Cash On Delivery (COD)
                  </div>
                  <span className="font-bold text-slate-900">
                    ₹{data?.paymentMethodBreakdown?.cod?.toLocaleString("en-IN") || 0}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 mt-3 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{
                      width: `${
                        data?.paymentMethodBreakdown
                          ? (data.paymentMethodBreakdown.cod /
                              (data.paymentMethodBreakdown.online +
                                data.paymentMethodBreakdown.cod || 1)) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-3.5 rounded-2xl bg-amber-50 border border-amber-200/60 text-amber-900 text-xs flex items-start gap-2">
            <Building2 size={16} className="shrink-0 text-amber-600 mt-0.5" />
            <span>
              Bank payouts are processed daily after delivery confirmation.
            </span>
          </div>
        </div>
      </div>

      {/* ================= TRANSACTIONS LEDGER ================= */}
      <div className="rounded-3xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Transaction History</h2>
            <p className="text-xs text-slate-500">Itemized payment clearances for recent orders</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Transaction / Order</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Outlet</th>
                <th className="py-3.5 px-4">Channel</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Settled Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center">
                    <Loader2 className="animate-spin mx-auto text-slate-400" size={24} />
                  </td>
                </tr>
              ) : data?.transactions?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No payment records logged yet.
                  </td>
                </tr>
              ) : (
                data?.transactions?.map((t) => (
                  <tr key={t.rawId} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-800">{t.id}</div>
                      <div className="text-[10px] text-slate-400">{t.date}</div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {t.customer}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {t.shopName}
                    </td>

                    <td className="py-3.5 px-4 font-semibold uppercase text-slate-500 text-[10px]">
                      {t.paymentMethod}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          t.paymentStatus === "paid"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {t.paymentStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 text-sm">
                      {t.amount}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}