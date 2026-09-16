// src/context/UserContext.jsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  fetchCurrentUser,
  logoutUser,
} from "../services/authService";
import * as cartService from "../services/cartService";
import * as wishlistService from "../services/wishlistService";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync Guest localStorage items directly to MongoDB
  const syncGuestDataToAccount = async () => {
    try {
      // 1. Sync Guest Cart
      const localCart = JSON.parse(localStorage.getItem("snackdrop_cart") || "[]");
      if (localCart.length > 0) {
        for (const item of localCart) {
          const productId = item.product?._id || item.product?.id || item.product;
          const quantity = item.quantity || 1;
          if (productId) {
            await cartService.addToCart(productId, quantity);
          }
        }
        localStorage.removeItem("snackdrop_cart");
      }

      // 2. Sync Guest Wishlist
      const localWishlist = JSON.parse(localStorage.getItem("snackdrop_wishlist") || "[]");
      if (localWishlist.length > 0) {
        for (const item of localWishlist) {
          const productId = item._id || item.id || item;
          if (productId) {
            await wishlistService.addToWishlist(productId);
          }
        }
        localStorage.removeItem("snackdrop_wishlist");
      }
    } catch (error) {
      console.warn("Error syncing guest data to account:", error);
    }
  };

  // Check logged-in user on mount
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const response = await fetchCurrentUser();
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUser();
  }, []);

  // Login handler with auto-sync
  const login = async (userData) => {
    setUser(userData);
    await syncGuestDataToAccount();
  };

  // Logout handler
  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        loading,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error(
      "useUser must be used inside UserProvider"
    );
  }

  return context;
};