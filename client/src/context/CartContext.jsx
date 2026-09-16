// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import * as cartService from "../services/cartService";
import { useUser } from "./UserContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000); // Disappears automatically after 3 seconds
  };

  // Load Cart
  const fetchCart = async () => {
    try {
      if (isAuthenticated) {
        const data = await cartService.getCart();
        if (data.success && data.cart) {
          setCartItems(data.cart.items || []);
        }
      } else {
        const local = localStorage.getItem("snackdrop_cart");
        setCartItems(local ? JSON.parse(local) : []);
      }
    } catch (err) {
      console.warn("Cart fetch failed, using local storage:", err);
      const local = localStorage.getItem("snackdrop_cart");
      setCartItems(local ? JSON.parse(local) : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const saveLocalCart = (items) => {
    setCartItems(items);
    localStorage.setItem("snackdrop_cart", JSON.stringify(items));
  };

  // Add Item
  const addToCart = async (product, quantity = 1) => {
    const productId = product._id || product.id;
    let newCount = cartCount + quantity;

    if (isAuthenticated) {
      try {
        await cartService.addToCart(productId, quantity);
        await fetchCart();
      } catch (err) {
        console.error("API Add to Cart error:", err);
      }
    } else {
      const existingIndex = cartItems.findIndex(
        (item) => (item.product?._id || item.product?.id || item.product) === productId
      );

      let updated = [...cartItems];
      if (existingIndex > -1) {
        updated[existingIndex].quantity += quantity;
      } else {
        updated.push({ product, quantity });
      }
      saveLocalCart(updated);
    }

    // Trigger Floating Pop-up Notification
    const itemName = product.name ? `"${product.name}"` : "Item";
    triggerToast(`🛒 ${itemName} added! (${newCount} in Cart)`);
  };

  // Remove Item
  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      try {
        await cartService.removeFromCart(productId);
        await fetchCart();
      } catch (err) {
        console.error("API Remove Cart error:", err);
      }
    } else {
      const updated = cartItems.filter(
        (item) => (item.product?._id || item.product?.id || item.product) !== productId
      );
      saveLocalCart(updated);
    }
  };

  // Clear Cart
  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartService.clearCart();
        setCartItems([]);
      } catch (err) {
        console.error("API Clear Cart error:", err);
      }
    } else {
      saveLocalCart([]);
    }
  };

  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        loading,
        addToCart,
        removeFromCart,
        clearCart,
        fetchCart,
      }}
    >
      {children}

      {/* GLOBAL FLOATING CART TOAST (Appears on every page when adding to cart) */}
      {showToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#17191c] px-5 py-3 text-sm font-semibold text-white shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300">
          {toastMessage}
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);