// src/context/WishlistContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import * as wishlistService from "../services/wishlistService";
import { useUser } from "./UserContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useUser();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [toastMessage, setToastMessage] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const fetchWishlist = async () => {
    try {
      if (isAuthenticated) {
        const data = await wishlistService.getWishlist();
        if (data.success && data.wishlist) {
          setWishlistItems(data.wishlist.items || []);
        }
      } else {
        const local = localStorage.getItem("snackdrop_wishlist");
        setWishlistItems(local ? JSON.parse(local) : []);
      }
    } catch (err) {
      console.warn("Wishlist fetch failed, using local storage:", err);
      const local = localStorage.getItem("snackdrop_wishlist");
      setWishlistItems(local ? JSON.parse(local) : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  const saveLocalWishlist = (items) => {
    setWishlistItems(items);
    localStorage.setItem("snackdrop_wishlist", JSON.stringify(items));
  };

  const toggleWishlist = async (product) => {
    const productId = product._id || product.id || product;
    const isFav = isFavorite(productId);
    const itemName = product.name ? `"${product.name}"` : "Item";

    if (isAuthenticated) {
      try {
        if (isFav) {
          await wishlistService.removeFromWishlist(productId);
          triggerToast(`💔 Removed ${itemName} from Wishlist`);
        } else {
          await wishlistService.addToWishlist(productId);
          triggerToast(`❤️ Saved ${itemName} to Wishlist!`);
        }
        await fetchWishlist();
      } catch (err) {
        console.error("API Wishlist Toggle error:", err);
      }
    } else {
      let updated;
      if (isFav) {
        updated = wishlistItems.filter(
          (item) => (item._id || item.id || item) !== productId
        );
        triggerToast(`💔 Removed ${itemName} from Wishlist`);
      } else {
        updated = [...wishlistItems, product];
        triggerToast(`❤️ Saved ${itemName} to Wishlist!`);
      }
      saveLocalWishlist(updated);
    }
  };

  // CLEAR WISHLIST FUNCTION
  const clearWishlist = async () => {
    if (isAuthenticated) {
      try {
        await wishlistService.clearWishlist();
        setWishlistItems([]);
        triggerToast("🗑️ Wishlist cleared!");
      } catch (err) {
        console.error("API Clear Wishlist error:", err);
      }
    } else {
      saveLocalWishlist([]);
      triggerToast("🗑️ Wishlist cleared!");
    }
  };

  const isFavorite = (productId) => {
    const targetId = String(productId);
    return wishlistItems.some(
      (item) => String(item._id || item.id || item) === targetId
    );
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount,
        loading,
        toggleWishlist,
        clearWishlist,
        isFavorite,
        fetchWishlist,
      }}
    >
      {children}

      {showToast && (
        <div className="fixed bottom-20 right-5 z-50 flex items-center gap-2 rounded-full bg-[#FF6840] px-5 py-3 text-sm font-semibold text-white shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300">
          {toastMessage}
        </div>
      )}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);