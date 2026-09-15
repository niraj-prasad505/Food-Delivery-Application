// src/components/admin/AdminSidebar.jsx
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  StoreIcon,
  PackageIcon,
  CartIcon,
  StarIcon,
  RupeeIcon,
  SettingsIcon,
  LogOutIcon,
  CloseIcon,
} from "./Icons";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: HomeIcon, end: true },
  { to: "/admin/shops", label: "Shops", icon: StoreIcon },
  { to: "/admin/products", label: "Products", icon: PackageIcon },
  { to: "/admin/orders", label: "Orders", icon: CartIcon },
  { to: "/admin/reviews", label: "Reviews", icon: StarIcon },
  { to: "/admin/revenue", label: "Revenue", icon: RupeeIcon },
  { to: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

const navLinkClasses = ({ isActive }) =>
  [
    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14.5px] font-medium transition-colors",
    isActive
      ? "bg-gradient-to-br from-[#ff5a36] to-[#e14a22] text-white shadow-[0_4px_12px_rgba(255,90,54,0.28)]"
      : "text-gray-500 hover:bg-[#fff0ea] hover:text-[#e14a22]",
  ].join(" ");

/**
 * isOpen / onClose control the mobile/tablet slide-out drawer (<=1024px).
 * On desktop the sidebar is always visible and these props are unused.
 */
export default function AdminSidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay for mobile/tablet drawer */}
      <div
        onClick={onClose}
        className={[
          "fixed inset-0 bg-black/40 z-50 transition-opacity lg:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      <aside
        className={[
          "w-[260px] shrink-0 bg-white border-r border-gray-100 flex flex-col p-4",
          "fixed lg:sticky top-0 h-screen overflow-y-auto z-[60] transition-transform duration-300",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between px-2 pb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff5a36] to-[#e14a22] flex items-center justify-center text-white shrink-0">
              <StoreIcon size={20} />
            </div>
            <div className="leading-tight">
              <p className="text-[18px] font-extrabold text-gray-900">
                Snack<span className="text-[#ff5a36]">Drop</span>
              </p>
              <p className="text-[11px] text-gray-400">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50"
            aria-label="Close menu"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={navLinkClasses} onClick={onClose}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-gray-100 pt-3 mt-3">
          <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14.5px] font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700">
            <LogOutIcon size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
