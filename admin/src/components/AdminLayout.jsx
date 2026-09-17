import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useAdmin } from "../context/AdminContext";
import { Loader2 } from "lucide-react";

export default function AdminLayout() {
  const { admin, loading } = useAdmin();
  const location = useLocation();

  // 1. Wait until backend verifies the adminToken cookie
  if (loading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-3 bg-slate-50 font-sans">
        <Loader2 className="animate-spin text-orange-600" size={36} />
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Verifying merchant session...
        </p>
      </div>
    );
  }

  // 2. If unauthenticated, redirect straight to /login
  if (!admin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Render dashboard layout with proper mobile & desktop sidebar spacing
  return (
    <div className="min-h-screen bg-slate-50/50">
      <Sidebar />
      <div className="flex min-h-screen flex-col lg:pl-72 transition-all duration-300">
        <Navbar />
        <main className="flex-1 pt-16 lg:pt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}