import API from "./api";

// Register user
export const registerUser = (userData) => {
  return API.post("/users/register", userData);
};

// Create OTP
export const createOtp = (email) => {
  return API.post("/users/create-otp", { email });
};

// Login with password
export const loginUser = (credentials) => {
  return API.post("/users/login", credentials);
};

// Create login OTP
export const createLoginOtp = (email) => {
  return API.post("/users/create-login-otp", {
    email,
  });
};

// Login with OTP
export const loginWithOtp = (email, otp) => {
  return API.post("/users/login-otp", {
    email,
    otp,
  });
};

// Logout
export const logoutUser = () => {
  return API.post("/users/logout");
};

// Get current user
export const fetchCurrentUser = () => {
  return API.get("/users/me");
};

// Forgot password
export const requestPasswordReset = (email) => {
  return API.post("/users/forgot-password", {
    email,
  });
};

// Reset password
export const resetUserPassword = (
  token,
  password,
  confirmPassword
) => {
  return API.post(`/user/reset-password/${token}`, {
    password,
    confirmPassword,
  });
};