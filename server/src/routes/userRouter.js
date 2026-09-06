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
    loginOtp
} = require("../controllers/UserAuth.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.post("/register", register);
router.post("/create-otp", createOtp);

router.post("/login", login);

router.post("/login-otp", loginOtp);
router.post("/create-login-otp", createLoginOtp);

router.post("/logout", logout);

router.get("/me", authMiddleware, getCurrentUser);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

module.exports = router;