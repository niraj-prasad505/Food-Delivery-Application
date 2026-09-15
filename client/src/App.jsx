// client/src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ShopListing from "./pages/ShopListing";
import ShopDetails from "./pages/ShopDetails";
import ProductDetails from "./pages/ProductDetails";
import Navbar from "./components/navbar";
import Cart from "./pages/Cart";
import ExploreFoods from "./pages/ExploreFoods";
import Wishlist from "./pages/Wishlist";
import Footer from "./components/footer";
import Dashboard from "./pages/admin/Dashboard";
import Shops from "./pages/admin/Shops";
import Profile from "./pages/Profile";
import AdminRegister from "./pages/admin/AdminRegister";
import AdminLogin from "./pages/admin/AdminLogin";

// Admin pages render their own AdminSidebar/AdminHeader (see AdminLayout),
// so the customer Navbar/Footer must not render on top of them.
function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurants" element={<ShopListing />} />
        <Route path="/restaurant/:id" element={<ShopDetails />} />
        <Route path="/restaurant/:id/menu" element={<ShopDetails />} />
        <Route path="/food/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/explore" element={<ExploreFoods />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/profile" element={<Profile />} />

        {/* Admin panel */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/shops" element={<Shops />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;