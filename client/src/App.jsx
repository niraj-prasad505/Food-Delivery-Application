// client/src/App.jsx

import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import ScrollToTop from "../src/components/Helper/ScrollToTop";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ShopListing from "./pages/ShopListing";
import ShopDetails from "./pages/ShopDetails";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import ExploreFoods from "./pages/ExploreFoods";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Footer from "./components/footer";
import Profile from "./pages/Profile";
import Navbar from "./components/navbar";
import Address from "./pages/Address";

import { useUser } from "./context/UserContext";

// Protected Route Guard Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useUser();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-sm font-medium">Checking authentication...</p>
      </div>
    );
  }

  // If not logged in, redirect to login page and remember where they wanted to go
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      {/* 🚀 SCROLL TO TOP PLACED OUTSIDE <Routes> */}
      <ScrollToTop />

      <Navbar />

      <Routes>
        {/* Customer Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/restaurants" element={<ShopListing />} />
        <Route path="/restaurant/:id" element={<ShopDetails />} />
        <Route path="/restaurant/:id/menu" element={<ShopDetails />} />
        <Route path="/food/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/explore" element={<ExploreFoods />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/address" element={<Address />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;