// src/pages/admin/Dashboard.jsx

import { useEffect, useState } from "react";

import AdminLayout from "../../components/admin/AdminLayout";
import StatCard from "../../components/admin/StatCard";
import DataTable from "../../components/admin/DataTable";
import StatusBadge from "../../components/admin/StatusBadge";
import OrdersChart from "../../components/admin/OrdersChart";

import { useAdmin } from "../../context/AdminContext";

import {
  getDashboardData,
} from "../../services/adminDashboardService";

import {
  quickActions,
} from "../../data/admin/dashboardData";

import {
  CartIcon,
  StoreIcon,
  PackageIcon,
  RupeeIcon,
  PercentIcon,
  MegaphoneIcon,
  ArrowRightIcon,
} from "../../components/admin/Icons";


// -----------------------------
// Icons
// -----------------------------

const STAT_ICONS = {
  orders: CartIcon,
  shops: StoreIcon,
  products: PackageIcon,
  revenue: RupeeIcon,
};

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


// -----------------------------
// Table Columns
// -----------------------------

const recentOrdersColumns = [
  {
    key: "id",
    label: "Order ID",
    primary: true,
  },
  {
    key: "customer",
    label: "Customer",
  },
  {
    key: "shop",
    label: "Shop",
  },
  {
    key: "amount",
    label: "Amount",
  },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <StatusBadge status={row.status} />
    ),
  },
];

const topProductsColumns = [
  {
    key: "name",
    label: "Product",
    primary: true,
  },
  {
    key: "shop",
    label: "Shop",
  },
  {
    key: "orders",
    label: "Orders",
  },
  {
    key: "revenue",
    label: "Revenue",
  },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <StatusBadge status={row.status} />
    ),
  },
];


// -----------------------------
// Dashboard
// -----------------------------

export default function Dashboard() {
  const { admin } = useAdmin();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // -----------------------------
  // Fetch Dashboard Data
  // -----------------------------

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getDashboardData();

        console.log("Dashboard response:", response);

        if (!response.success) {
          throw new Error(
            response.message ||
              "Failed to load dashboard"
          );
        }

        setDashboardData(response.data);
      } catch (error) {
        console.error(
          "Dashboard error:",
          error
        );

        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);


  // -----------------------------
  // Loading
  // -----------------------------

  if (loading) {
    return (
      <AdminLayout
        title="Welcome back, Admin! 👋"
        subtitle="Here's what's happening with SnackDrop today."
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-500">
            Loading dashboard...
          </p>
        </div>
      </AdminLayout>
    );
  }


  // -----------------------------
  // Error
  // -----------------------------

  if (error) {
    return (
      <AdminLayout
        title="Welcome back, Admin! 👋"
        subtitle="Here's what's happening with SnackDrop today."
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-red-500">
            {error}
          </p>
        </div>
      </AdminLayout>
    );
  }


  // -----------------------------
  // No Data
  // -----------------------------

  if (!dashboardData) {
    return (
      <AdminLayout
        title="Welcome back, Admin! 👋"
        subtitle="Here's what's happening with SnackDrop today."
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-500">
            No dashboard data available.
          </p>
        </div>
      </AdminLayout>
    );
  }


  // -----------------------------
  // API Data
  // -----------------------------

  const {
    stats = {},
    ordersOverview = [],
    recentOrders = [],
    topProducts = [],
  } = dashboardData;


  // Convert backend stats object
  // into the format expected by StatCard

  const dashboardStats = [
    {
      id: "orders",
      label: "Total Orders",
      value: stats.orders?.value ?? 0,
      change: stats.orders?.change ?? "",
      trend: stats.orders?.trend ?? "up",
      color: "red",
    },
    {
      id: "shops",
      label: "Total Shops",
      value: stats.shops?.value ?? 0,
      change: stats.shops?.change ?? "",
      trend: stats.shops?.trend ?? "up",
      color: "orange",
    },
    {
      id: "products",
      label: "Total Products",
      value: stats.products?.value ?? 0,
      change: stats.products?.change ?? "",
      trend: stats.products?.trend ?? "up",
      color: "green",
    },
    {
      id: "revenue",
      label: "Total Revenue",
      value: `₹${stats.revenue?.value ?? 0}`,
      change: stats.revenue?.change ?? "",
      trend: stats.revenue?.trend ?? "up",
      color: "blue",
    },
  ];


  // -----------------------------
  // Quick Action
  // -----------------------------

  const handleQuickAction = (id) => {
    console.log("Quick action:", id);
  };


  // -----------------------------
  // UI
  // -----------------------------

  return (
    <AdminLayout
      title="Welcome back, Admin! 👋"
      subtitle="Here's what's happening with SnackDrop today."
    >

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

        {/* Orders Chart */}

        <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_2px_18px_rgba(24,24,48,0.06)] p-5">

          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">

            <h2 className="text-[16px] font-bold text-gray-900">
              Orders Overview
            </h2>

            <span className="text-[12.5px] font-semibold text-gray-600 bg-[#f6f7fb] border border-gray-200 px-3 py-1.5 rounded-full">
              Last 7 Days
            </span>

          </div>

          <OrdersChart
            data={ordersOverview}
          />

        </div>


        {/* Quick Actions */}

        <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_2px_18px_rgba(24,24,48,0.06)] p-5">

          <h2 className="text-[16px] font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 gap-3">

            {quickActions.map((action) => {

              const Icon =
                QUICK_ACTION_ICONS[action.id];

              return (
                <button
                  key={action.id}
                  onClick={() =>
                    handleQuickAction(action.id)
                  }
                  className="flex flex-col items-start gap-5 rounded-xl border border-gray-100 bg-[#f6f7fb] p-4 text-left hover:-translate-y-0.5 hover:shadow-[0_2px_18px_rgba(24,24,48,0.06)] transition"
                >

                  <span
                    className={`w-9 h-9 rounded-[10px] flex items-center justify-center ${QUICK_ACTION_BG[action.color]}`}
                  >
                    <Icon size={18} />
                  </span>

                  <span className="text-[13px] font-bold text-gray-900">
                    {action.label}
                  </span>

                </button>
              );
            })}

          </div>

        </div>

      </div>


      {/* Recent orders + Top products */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4.5">

        {/* Recent Orders */}

        <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_2px_18px_rgba(24,24,48,0.06)] p-5">

          <div className="flex items-center justify-between mb-4">

            <h2 className="text-[16px] font-bold text-gray-900">
              Recent Orders
            </h2>

            <a
              href="/admin/orders"
              className="text-[13px] font-semibold text-[#ff5a36] flex items-center gap-1"
            >
              View all
              <ArrowRightIcon />
            </a>

          </div>

          <DataTable
            columns={recentOrdersColumns}
            rows={recentOrders}
          />

        </div>


        {/* Top Products */}

        <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_2px_18px_rgba(24,24,48,0.06)] p-5">

          <div className="flex items-center justify-between mb-4">

            <h2 className="text-[16px] font-bold text-gray-900">
              Top Products
            </h2>

            <a
              href="/admin/products"
              className="text-[13px] font-semibold text-[#ff5a36] flex items-center gap-1"
            >
              View all
              <ArrowRightIcon />
            </a>

          </div>

          <DataTable
            columns={topProductsColumns}
            rows={topProducts}
          />

        </div>

      </div>

    </AdminLayout>
  );
}