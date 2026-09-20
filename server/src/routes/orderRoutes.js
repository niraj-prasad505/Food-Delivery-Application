const express = require("express");
const router = express.Router();
const {
  createOrder,
  createRazorpayOrder,
  verifyPayment,
  getMyOrders,
  handleRazorpayWebhook, // <--- Import here
} = require("../controllers/Order.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Customer routes (authenticated)
router.post("/create", authMiddleware, createOrder);
router.post("/razorpay-order", authMiddleware, createRazorpayOrder);
router.post("/verify-payment", authMiddleware, verifyPayment);
router.get("/my-orders", authMiddleware, getMyOrders);

// Public Razorpay Webhook route (NO authMiddleware!)
router.post("/webhook", handleRazorpayWebhook);

module.exports = router;