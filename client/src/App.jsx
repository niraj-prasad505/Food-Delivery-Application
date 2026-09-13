// client/src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ShopListing from "./pages/ShopListing";
import ShopDetails from "./pages/ShopDetails";
import Navbar from "./components/navbar";
import Cart from "./pages/Cart";
import ExploreFoods from "./pages/ExploreFoods";
import Wishlist from "./pages/Wishlist";
import Footer from "./components/footer";

function App() {
  return (
    <BrowserRouter>
      {/* Global Navbar */}
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurants" element={<ShopListing />} />
        
        {/* Dynamic Shop Page Routes */}
        <Route path="/restaurant/:id" element={<ShopDetails />} />
        <Route path="/restaurant/:id/menu" element={<ShopDetails />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/explore" element={<ExploreFoods />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>

      {/* Global Footer */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;