// client/src/services/userService.js
import API from "./api";

export const getProfile = async () => {
  const response = await API.get("/users/profile");
  return response.data;
};

export const updateProfile = async (userData) => {
  const response = await API.put("/users/profile", userData);
  return response.data;
};

export const deleteProfile = async () => {
  const response = await API.delete("/users/profile");
  return response.data;
};