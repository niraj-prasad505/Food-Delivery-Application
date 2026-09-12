import API from "./api";

// Get user's cart
export const getCart = async () => {
    const response = await API.get("/cart");
    return response.data;
};

// Add product to cart
export const addToCart = async (productId, quantity = 1) => {
    const response = await API.post("/cart/add", {
        productId,
        quantity,
    });

    return response.data;
};

// Update product quantity
export const updateCartItem = async (productId, quantity) => {
    const response = await API.patch("/cart/update", {
        productId,
        quantity,
    });

    return response.data;
};

// Remove product from cart
export const removeFromCart = async (productId) => {
    const response = await API.delete(
        `/cart/remove/${productId}`
    );

    return response.data;
};

// Clear entire cart
export const clearCart = async () => {
    const response = await API.delete("/cart/clear");
    return response.data;
};