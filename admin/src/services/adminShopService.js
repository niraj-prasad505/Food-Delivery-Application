import api from "./api";

export const getMyShops = async () => {
  const response = await api.get("/owner/shops");
  return response.data;
};

export const getShopById = async (shopId) => {
  const response = await api.get(`/owner/shops/${shopId}`);
  return response.data;
};

export const createShop = async (shopData) => {
  const response = await api.post("/owner/shops", shopData);
  return response.data;
};

export const updateShop = async (shopId, updateData) => {
  const response = await api.put(`/owner/shops/${shopId}`, updateData);
  return response.data;
};

export const deleteShop = async (shopId) => {
  const response = await api.delete(`/owner/shops/${shopId}`);
  return response.data;
};