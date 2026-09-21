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

  const syncGuestDataToAccount = async () => {
  try {
    const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");

    if (guestCart.length > 0) {
      for (const item of guestCart) {
        // Handle nested product objects or direct item IDs safely
        const productId = item.productId || item.product?._id || item._id || item.id;
        const quantity = item.quantity || 1;

        if (productId) {
          await addToCart({ productId, quantity });
        }
      }
      localStorage.removeItem("guestCart");
    }
  } catch (err) {
    console.error("Error syncing guest data to account:", err);
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