// client/src/services/productService.js
import API from "./api";

// Fetch single product by ID
export const getProductById = async (id) => {
  const response = await API.get(`/foods/${id}`);
  return response.data;
};

// Fetch all products (optional helper)
export const getAllProducts = async () => {
  const response = await API.get("/foods");
  return response.data;
};