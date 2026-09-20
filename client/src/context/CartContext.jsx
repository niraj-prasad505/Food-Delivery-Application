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
    }, 3000);
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

  // Add or Update Quantity
  const addToCart = async (product, quantity = 1) => {
    const productId = String(
      product._id || product.id || product.product?._id || product.product?.id || product || ""
    );

    const isRealMongoId = /^[0-9a-fA-F]{24}$/.test(productId);

    const normalizedProduct = {
      _id: productId,
      id: productId,
      name: product.name || product.product?.name || "Food Item",
      price: Number(product.price || product.product?.price || 0),
      discount: Number(product.discount || product.product?.discount || 0),
      image: product.image || product.product?.image || product.images?.[0] || "https://via.placeholder.com/150",
      category: product.category || product.product?.category || "General",
    };

    if (isAuthenticated && isRealMongoId) {
      try {
        await cartService.addToCart(productId, quantity);
        await fetchCart();
        triggerToast(`🛒 "${normalizedProduct.name}" added!`);
        return;
      } catch (err) {
        console.warn("API Add to Cart error, falling back to local storage:", err);
      }
    }

    // Guest mode / Mock items fallback
    const existingIndex = cartItems.findIndex((item) => {
      const itemProdId = String(item.product?._id || item.product?.id || item._id || item.id);
      return itemProdId === productId;
    });

    let updated = [...cartItems];
    if (existingIndex > -1) {
      const newQty = updated[existingIndex].quantity + quantity;
      if (newQty <= 0) {
        updated = updated.filter((_, idx) => idx !== existingIndex);
      } else {
        updated[existingIndex].quantity = newQty;
      }
    } else if (quantity > 0) {
      updated.push({ product: normalizedProduct, quantity });
    }

    saveLocalCart(updated);

    if (quantity > 0) {
      triggerToast(`🛒 "${normalizedProduct.name}" added!`);
    }
  };

  // Remove Item
  const removeFromCart = async (productId) => {
    const targetId = String(productId);
    if (isAuthenticated) {
      try {
        await cartService.removeFromCart(targetId);
        await fetchCart();
      } catch (err) {
        console.error("API Remove Cart error:", err);
      }
    } else {
      const updated = cartItems.filter((item) => {
        const itemProdId = String(item.product?._id || item.product?.id || item._id || item.id);
        return itemProdId !== targetId;
      });
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

      {/* GLOBAL FLOATING CART TOAST */}
      {showToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#17191c] px-5 py-3 text-sm font-semibold text-white shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300">
          {toastMessage}
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);