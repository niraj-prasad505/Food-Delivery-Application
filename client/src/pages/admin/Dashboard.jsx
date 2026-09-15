// src/pages/admin/Dashboard.jsx
import AdminLayout from "../../components/admin/AdminLayout";
import StatCard from "../../components/admin/StatCard";
import DataTable from "../../components/admin/DataTable";
import StatusBadge from "../../components/admin/StatusBadge";
import OrdersChart from "../../components/admin/OrdersChart";
import { useAdmin  } from "../../context/AdminContext";

import {
  CartIcon,
  StoreIcon,
  PackageIcon,
  RupeeIcon,
  PercentIcon,
  MegaphoneIcon,
  ArrowRightIcon,
} from "../../components/admin/Icons";
import { dashboardStats, ordersOverview, quickActions, recentOrders, topProducts } from "../../data/admin/dashboardData";

const STAT_ICONS = { orders: CartIcon, shops: StoreIcon, products: PackageIcon, revenue: RupeeIcon };
const QUICK_ACTION_ICONS = {
  "add-shop": StoreIcon,
  "add-product": PackageIcon,
  "create-offer": PercentIcon,
  "create-ad": MegaphoneIcon,
};
const QUICK_ACTION_BG = {
  red: "bg-rose-50 text-rose-500",
  orange: "bg-[#fff0ea] text-[#e14a22]",
  green: "bg-emerald-50 text-emerald-600",
  blue: "bg-blue-50 text-blue-600",
};

const recentOrdersColumns = [
  { key: "id", label: "Order ID", primary: true },
  { key: "customer", label: "Customer" },
  { key: "shop", label: "Shop" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
];

const topProductsColumns = [
  { key: "name", label: "Product", primary: true },
  { key: "shop", label: "Shop" },
  { key: "orders", label: "Orders" },
  { key: "revenue", label: "Revenue" },
  { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
];

export default function Dashboard() {
  const handleQuickAction = (id) => {
    // Frontend-only stub — wire these up to real create flows later.
    console.log("Quick action:", id);
  };

  

  // console.log("Admin in Dashboard:", admin);

  return (
    <AdminLayout title="Welcome back, Admin! 👋" subtitle="Here's what's happening with SnackDrop today.">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5 mb-5">
        {dashboardStats.map((stat) => (
          <StatCard
            key={stat.id}
            icon={STAT_ICONS[stat.id]}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            color={stat.color}
          />
        ))}
      </div>

      {/* Chart + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4.5 mb-5 items-stretch">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_2px_18px_rgba(24,24,48,0.06)] p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="text-[16px] font-bold text-gray-900">Orders Overview</h2>
            <span className="text-[12.5px] font-semibold text-gray-600 bg-[#f6f7fb] border border-gray-200 px-3 py-1.5 rounded-full">
              Last 7 Days
            </span>
          </div>
          <OrdersChart data={ordersOverview} />
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_2px_18px_rgba(24,24,48,0.06)] p-5">
          <h2 className="text-[16px] font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = QUICK_ACTION_ICONS[action.id];
              return (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action.id)}
                  className="flex flex-col items-start gap-5 rounded-xl border border-gray-100 bg-[#f6f7fb] p-4 text-left hover:-translate-y-0.5 hover:shadow-[0_2px_18px_rgba(24,24,48,0.06)] transition"
                >
                  <span className={`w-9 h-9 rounded-[10px] flex items-center justify-center ${QUICK_ACTION_BG[action.color]}`}>
                    <Icon size={18} />
                  </span>
                  <span className="text-[13px] font-bold text-gray-900">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent orders + Top products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4.5">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_2px_18px_rgba(24,24,48,0.06)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-bold text-gray-900">Recent Orders</h2>
            <a href="/admin/orders" className="text-[13px] font-semibold text-[#ff5a36] flex items-center gap-1">
              View all <ArrowRightIcon />
            </a>
          </div>
          <DataTable columns={recentOrdersColumns} rows={recentOrders} />
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_2px_18px_rgba(24,24,48,0.06)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-bold text-gray-900">Top Products</h2>
            <a href="/admin/products" className="text-[13px] font-semibold text-[#ff5a36] flex items-center gap-1">
              View all <ArrowRightIcon />
            </a>
          </div>
          <DataTable columns={topProductsColumns} rows={topProducts} />
        </div>
      </div>
    </AdminLayout>
  );
}
