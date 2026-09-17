import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <main className="ml-69">

        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <Outlet />

      </main>

    </div>
  );
}