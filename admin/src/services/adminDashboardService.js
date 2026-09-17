import api from "./api";

/**
 * Fetch authenticated owner's dashboard metrics
 * Endpoint: GET http://localhost:5000/api/admin/dashboard
 */
export const getAdminDashboard = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};