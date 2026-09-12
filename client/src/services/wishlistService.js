import API from "./api";

// Get user's wishlist
export const getWishlist = async () => {
    const response = await API.get("/wishlist");
    return response.data;
};

// Add product to wishlist
export const addToWishlist = async (productId) => {
    const response = await API.post("/wishlist/add", {
        productId,
    });

    return response.data;
};

// Remove product from wishlist
export const removeFromWishlist = async (productId) => {
    const response = await API.delete(
        `/wishlist/remove/${productId}`
    );

    return response.data;
};

// Clear entire wishlist
export const clearWishlist = async () => {
    const response = await API.delete(
        "/wishlist/clear"
    );

    return response.data;
};

// Check if product is in wishlist
export const checkWishlist = async (productId) => {
    const response = await API.get(
        `/wishlist/check/${productId}`
    );

    return response.data;
};