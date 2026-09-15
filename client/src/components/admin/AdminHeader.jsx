// src/components/admin/AdminHeader.jsx
import SearchBar from "./SearchBar";
import { MenuIcon, BellIcon } from "./Icons";

/**
 * title / subtitle describe the current page.
 * onMenuClick opens the mobile sidebar drawer (passed down from AdminLayout).
 */
export default function AdminHeader({ title, subtitle, onMenuClick }) {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40 px-4 sm:px-7 py-3.5 flex items-center gap-4">
      <button
        onClick={onMenuClick}
        className="lg:hidden w-9 h-9 shrink-0 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-700"
        aria-label="Open menu"
      >
        <MenuIcon size={20} />
      </button>

      <div className="shrink-0 min-w-0 hidden sm:block">
        <h1 className="text-[20px] sm:text-[22px] font-extrabold text-gray-900 leading-tight truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[13px] text-gray-400 mt-0.5 truncate max-w-[360px]">{subtitle}</p>
        )}
      </div>

      <div className="flex-1 max-w-[420px] ml-1 hidden md:block">
        <SearchBar placeholder="Search shops, products, orders..." />
      </div>

      <div className="flex items-center gap-3.5 ml-auto shrink-0">
        <button
          className="relative w-10 h-10 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-700"
          aria-label="Notifications"
        >
          <BellIcon size={18} />
          <span className="absolute -top-0.5 -right-0.5 w-[17px] h-[17px] rounded-full bg-[#ff5a36] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
            3
          </span>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ff5a36] to-[#e14a22] text-white flex items-center justify-center text-[13px] font-bold shrink-0">
            A
          </div>
          <div className="leading-tight hidden sm:block">
            <p className="text-[13.5px] font-bold text-gray-900">Admin</p>
            <p className="text-[11.5px] text-gray-400">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
