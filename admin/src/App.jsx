import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminProvider, useAdmin } from "./context/AdminContext";

// Auth Pages
import Login from "./pages/AdminLogin";
import Register from "./pages/AdminRegister";

// Layout & Protected Shell
import AdminLayout from "./components/AdminLayout";

// Admin Pages
import Dashboard from "./pages/Dashboard";
import Shops from "./pages/Shops";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Reviews from "./pages/Reviews";
import Revenue from "./pages/Revenue";
import Settings from "./pages/Settings";

// Prevent logged-in merchants from seeing Login / Register pages
function PublicRoute({ children }) {
  const { admin, loading } = useAdmin();

  if (loading) return null;
  if (admin) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <Routes>
          {/* ================= PUBLIC AUTH ================= */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* ================= PROTECTED ADMIN DASHBOARD ================= */}
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/shops" element={<Shops />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/revenue" element={<Revenue />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Fallback wildcard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AdminProvider>
  );
}