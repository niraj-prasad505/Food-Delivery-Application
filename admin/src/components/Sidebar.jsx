import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import sparklesIcon from "../assets/snackdrop-icon.png";
import icon from "../assets/icon.png";

import {
  LayoutDashboard,
  Store,
  Package,
  ShoppingBag,
  Star,
  IndianRupee,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";

const NAV_GROUPS = [
  {
    label: "Main",
    items: [
      { name: "Dashboard", path: "/", icon: LayoutDashboard },
      { name: "Shops", path: "/shops", icon: Store },
      { name: "Products", path: "/products", icon: Package },
      { name: "Orders", path: "/orders", icon: ShoppingBag },
    ],
  },
  {
    label: "Analytics & Feedback",
    items: [
      { name: "Reviews", path: "/reviews", icon: Star },
      { name: "Revenue", path: "/revenue", icon: IndianRupee },
    ],
  },
  {
    label: "System",
    items: [{ name: "Settings", path: "/settings", icon: Settings }],
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, logout } = useAdmin();

  // Prevent background scroll when mobile sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close sidebar automatically on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    setIsOpen(false);
    if (logout) {
      await logout();
    }
    navigate("/admin/login");
  };

  const adminName = admin?.name || admin?.username || "Admin";
  const avatarLetter = adminName.charAt(0).toUpperCase();

  return (
    <>
      {/* ================= MOBILE TOP APP BAR ================= */}
      <div className="fixed top-0 left-0 right-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-600 p-1.5 shadow-xs overflow-hidden">
            <img
              src={sparklesIcon}
              alt="SnackDrop Icon"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <img
              src={icon}
              alt="SnackDrop"
              className="h-5 max-w-32.5 object-contain object-left"
            />
            <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase mt-0.5">
              Partner Hub
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 text-slate-600 hover:bg-slate-50 active:scale-95 transition"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* ================= BACKDROP OVERLAY ================= */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200/80 bg-white transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-20 shrink-0 items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-600 p-2 shadow-md shadow-orange-500/20 overflow-hidden">
              <img
                src={sparklesIcon}
                alt="SnackDrop Icon"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <img
                src={icon}
                alt="SnackDrop"
                className="h-6 max-w-32.5 object-contain object-left"
              />
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mt-0.5">
                Merchant Portal
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition lg:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                {group.label}
              </p>

              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/"}
                    className={({ isActive }) =>
                      `group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-150 ${
                        isActive
                          ? "bg-orange-500 text-white shadow-sm shadow-orange-500/25"
                          : "text-slate-600 hover:bg-orange-50/70 hover:text-orange-600"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <Icon
                            size={18}
                            strokeWidth={2.2}
                            className={`transition-colors ${
                              isActive
                                ? "text-white"
                                : "text-slate-400 group-hover:text-orange-500"
                            }`}
                          />
                          <span>{item.name}</span>
                        </div>

                        {isActive && (
                          <ChevronRight
                            size={14}
                            className="text-white/80"
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Badge & Logout Section */}
        <div className="shrink-0 p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-600 font-bold text-white text-xs shadow-xs">
              {avatarLetter}
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-xs font-bold text-slate-800 leading-tight">
                {adminName}
              </p>
              <span className="text-[10px] font-medium text-slate-400 block truncate">
                {admin?.email || "Partner Admin"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200/80 bg-white py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 hover:border-rose-200 active:scale-95 shadow-2xs"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}