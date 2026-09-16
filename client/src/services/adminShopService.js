// src/services/adminShopService.js

import API from "./api";

const adminShopService = {
  getAllShops: async () => {
    const response = await API.get("/shops");
    return response.data;
  },

  getShopById: async (shopId) => {
    const response = await API.get(`/shops/${shopId}`);
    return response.data;
  },

  createShop: async (shopData) => {
    const response = await API.post(
      "/shops",
      shopData
    );

    return response.data;
  },

  updateShop: async (shopId, shopData) => {
    const response = await API.patch(
      `/shops/${shopId}`,
      shopData
    );

    return response.data;
  },

  updateShopLocation: async (
    shopId,
    latitude,
    longitude
  ) => {
    const response = await API.patch(
      `/shops/${shopId}/location`,
      {
        latitude,
        longitude,
      }
    );

    return response.data;
  },

  deleteShop: async (shopId) => {
    const response = await API.delete(
      `/shops/${shopId}`
    );

    return response.data;
  },
};

export default adminShopService;