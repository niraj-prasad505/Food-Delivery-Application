import API from "./api";

export const getDashboardData = async () => {
  try {
    const response = await API.get("/admin/dashboard");

    return response.data;
  } catch (error) {
    console.error(
      "Failed to fetch admin dashboard data:",
      error
    );

    throw error;
  }
};