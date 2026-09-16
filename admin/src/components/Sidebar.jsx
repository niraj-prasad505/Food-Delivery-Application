import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Store,
  Package,
  ShoppingCart,
  Star,
  IndianRupee,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Shops",
    path: "/shops",
    icon: Store,
  },
  {
    name: "Products",
    path: "/products",
    icon: Package,
  },
  {
    name: "Orders",
    path: "/orders",
    icon: ShoppingCart,
  },
  {
    name: "Reviews",
    path: "/reviews",
    icon: Star,
  },
  {
    name: "Revenue",
    path: "/revenue",
    icon: IndianRupee,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <>
      {/* ================= MOBILE HEADER ================= */}

      <div className="fixed top-0 left-0 right-0 z-30 flex h-16 items-center justify-between bg-white px-4 shadow-sm lg:hidden">
        <div>
          <h1 className="text-lg font-bold text-gray-900">
            Snack<span className="text-orange-500">Drop</span>
          </h1>

          <p className="text-[10px] text-gray-400">
            Admin Panel
          </p>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* ================= OVERLAY ================= */}

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-64 flex-col bg-white
          transition-transform duration-300 ease-in-out

          ${isOpen ? "translate-x-0" : "-translate-x-full"}

          lg:translate-x-0
        `}
      >
        {/* ================= LOGO ================= */}

        <div className="flex h-20 shrink-0 items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Snack<span className="text-orange-500">Drop</span>
            </h1>

            <p className="text-xs text-gray-400">
              Admin Panel
            </p>
          </div>

          {/* Mobile Close */}
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* ================= NAVIGATION ================= */}

        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-orange-500 text-white"
                        : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                    }`
                  }
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* ================= LOGOUT ================= */}

        <div className="shrink-0 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}