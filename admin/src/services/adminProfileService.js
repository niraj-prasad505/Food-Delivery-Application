import api from "./api";

// Fetch current owner profile
export const getAdminProfile = async () => {
  const response = await api.get("/owner/profile");
  return response.data;
};

// Update profile details (name, phone)
export const updateAdminProfile = async (profileData) => {
  const response = await api.put("/owner/profile", profileData);
  return response.data;
};

// Change security password
export const changeAdminPassword = async (passwords) => {
  const response = await api.put("/owner/profile/password", passwords);
  return response.data;
};