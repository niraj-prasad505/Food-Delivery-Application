
import API from "./api";

// Admin password login
export const adminLogin = (data) => {
  return API.post("/owner-auth/login", data);
};

// Create admin login OTP
export const createAdminLoginOtp = (email) => {
  return API.post("/owner-auth/create-login-otp", {
    email,
  });
};

// Admin OTP login
export const adminLoginWithOtp = (email, otp) => {
  return API.post("/owner-auth/login-otp", {
    email,
    otp,
  });
};

// Get logged-in admin
export const getCurrentAdmin = () => {
  return API.get("/owner-auth/me");
};

// Admin logout
export const adminLogout = () => {
  return API.post("/owner-auth/logout");
};

// Forgot password
export const adminForgotPassword = (email) => {
  return API.post("/owner-auth/forgot-password", {
    email,
  });
};

// Reset password
export const adminResetPassword = (
  token,
  password,
  confirmPassword
) => {
  return API.post(`/owner-auth/reset-password/${token}`, {
    password,
    confirmPassword,
  });
};

// Create admin registration OTP
export const createAdminRegistrationOtp = (email) => {
  return API.post("/owner-auth/create-otp", {
    email,
  });
};

// Register admin / owner
export const adminRegister = (data) => {
  return API.post("/owner-auth/register", data);
};

