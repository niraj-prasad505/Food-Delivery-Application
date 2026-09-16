// client/src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ShopListing from "./pages/ShopListing";
import ShopDetails from "./pages/ShopDetails";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import ExploreFoods from "./pages/ExploreFoods";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";

import Navbar from "./components/navbar";
import Footer from "./components/footer";

function App() {
  return (
    <BrowserRouter>
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

        <Route path="/cart" element={<Cart />} />

        <Route path="/explore" element={<ExploreFoods />} />

        <Route path="/wishlist" element={<Wishlist />} />

        <Route path="/profile" element={<Profile />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;