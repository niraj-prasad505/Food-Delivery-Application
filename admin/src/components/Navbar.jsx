import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronDown, LogOut, User, Settings, ShieldCheck } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { admin, logout } = useAdmin();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Dynamic admin details from context
  const adminName = admin?.name || admin?.username || "Admin";
  const adminEmail = admin?.email || "admin@snackdrop.com";
  const adminRole = admin?.role ? admin.role.toUpperCase() : "Store Owner";
  const avatarLetter = adminName.charAt(0).toUpperCase();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-8 backdrop-blur-md transition-all">
      {/* ================= LEFT: GREETING ================= */}
      <div>
        <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
          Welcome back, {adminName}! 👋
        </h1>
        <p className="hidden text-xs sm:block text-slate-500 mt-0.5">
          Here's what's happening with SnackDrop today.
        </p>
      </div>

      {/* ================= RIGHT: ACTIONS & PROFILE ================= */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notifications */}
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 active:scale-95"
          aria-label="Notifications"
        >
          <Bell size={19} strokeWidth={2.2} />
          {/* Unread indicator badge */}
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        {/* Profile Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-3 rounded-xl p-1.5 transition hover:bg-slate-50 focus:outline-hidden"
          >
            {/* Avatar */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-600 font-bold text-white shadow-xs">
              {avatarLetter}
            </div>

            {/* Admin Info */}
            <div className="hidden text-left md:block">
              <p className="text-sm font-semibold leading-tight text-slate-800">
                {adminName}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <ShieldCheck size={12} className="text-emerald-600" />
                <span className="text-[11px] font-medium text-slate-400">
                  {adminRole}
                </span>
              </div>
            </div>

            <ChevronDown
              size={16}
              className={`text-slate-400 transition-transform duration-200 hidden sm:block ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* ================= POPUP MENU ================= */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200/90 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in-0 zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Signed in as
                </p>
                <p className="truncate text-xs font-semibold text-slate-800 mt-0.5">
                  {adminEmail}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/settings");
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <User size={15} className="text-slate-400" />
                Store Profile
              </button>

              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/settings");
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <Settings size={15} className="text-slate-400" />
                Preferences
              </button>

              <div className="my-1 border-t border-slate-100" />

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}