const express = require("express");

const router = express.Router();

const {
    register,
    login,
    logout,
    getCurrentOwner,
    forgotPassword,
    resetPassword,
    createOtp,
    createLoginOtp,
    loginOtp
} = require("../controllers/OwnerAuth.controller");

const authMiddleware = require("../middleware/owner-auth.middleware");

router.post("/register", register);
router.post("/create-otp", createOtp);

router.post("/login", login);

router.post("/login-otp", loginOtp);
router.post("/create-login-otp", createLoginOtp);

router.post("/logout", logout);

router.get("/me", authMiddleware, getCurrentOwner);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

module.exports = router;