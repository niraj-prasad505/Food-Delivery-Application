// server/src/routes/userRouter.js
const express = require("express");
const router = express.Router();

const {
    register,
    login,
    logout,
    getCurrentUser,
    forgotPassword,
    resetPassword,
    createOtp,
    createLoginOtp,
    loginOtp,
    switchToMerchant
} = require("../controllers/UserAuth.controller");

const {
    getProfile,
    updateProfile,
    deleteUserProfile,
} = require("../controllers/user.controller");

const authMiddleware = require("../middleware/auth.middleware");

// Auth Routes
router.post("/register", register);
router.post("/create-otp", createOtp);
router.post("/login", login);
router.post("/login-otp", loginOtp);
router.post("/create-login-otp", createLoginOtp);
router.post("/logout", logout);
router.get("/me", authMiddleware, getCurrentUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Profile Routes
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.patch("/profile", authMiddleware, updateProfile);

// Switch Role Route
router.post("/switch-merchant", authMiddleware, switchToMerchant);
// delete account button
router.delete("/profile", authMiddleware, deleteUserProfile);

module.exports = router;