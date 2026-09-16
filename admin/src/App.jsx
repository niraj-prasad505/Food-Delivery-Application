import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// Auth
import Login from "./pages/AdminLogin";
import Register from "./pages/AdminRegister";

// Layout
import AdminLayout from "./components/AdminLayout";

// Admin pages
import Dashboard from "./pages/Dashboard";
import Shops from "./pages/Shops";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Reviews from "./pages/Reviews";
import Revenue from "./pages/Revenue";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= AUTH ================= */}

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />


        {/* ================= ADMIN ================= */}

        <Route element={<AdminLayout />}>

          <Route path="/" element={<Dashboard />} />

          <Route path="/shops" element={<Shops />} />

          <Route path="/products" element={<Products />} />

          <Route path="/orders" element={<Orders />} />
    
          <Route path="/reviews" element={<Reviews />} />

          <Route path="/revenue" element={<Revenue />} />

          <Route path="/settings" element={<Settings />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}