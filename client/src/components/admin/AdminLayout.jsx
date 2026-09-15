// src/components/admin/AdminLayout.jsx
import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

/**
 * Wraps every admin page. Usage:
 *
 *   <AdminLayout title="Dashboard" subtitle="Welcome back, Admin!">
 *     <Dashboard />
 *   </AdminLayout>
 */
export default function AdminLayout({ title, subtitle, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-[#f6f7fb] min-h-screen text-gray-900 antialiased">
      <div className="flex min-h-screen w-full overflow-x-hidden">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 min-w-0 flex flex-col">
          <AdminHeader title={title} subtitle={subtitle} onMenuClick={() => setSidebarOpen(true)} />
          <main className="max-w-[1440px] w-full mx-auto px-4 sm:px-7 py-6 pb-12">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
