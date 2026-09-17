import api from "./api";

// Get all products owned by the admin (supports search and filter params)
export const getMyProducts = async (params = {}) => {
  const response = await api.get("/owner/products", { params });
  return response.data;
};

// Get single product details
export const getProductById = async (productId) => {
  const response = await api.get(`/owner/products/${productId}`);
  return response.data;
};

// Create product listing
export const createProduct = async (productData) => {
  const response = await api.post("/owner/products", productData);
  return response.data;
};

// Update product
export const updateProduct = async (productId, updateData) => {
  const response = await api.put(`/owner/products/${productId}`, updateData);
  return response.data;
};

// Delete product
export const deleteProduct = async (productId) => {
  const response = await api.delete(`/owner/products/${productId}`);
  return response.data;
};