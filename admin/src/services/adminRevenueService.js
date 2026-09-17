import api from "./api";

// Fetch revenue analytics with timeframe ('7d' or '30d') and optional shop filter
export const getMyRevenueAnalytics = async (params = {}) => {
  const response = await api.get("/owner/revenue", { params });
  return response.data;
};