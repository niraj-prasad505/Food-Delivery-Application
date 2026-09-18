const express = require("express");
const router = express.Router();
const { createOrder, getMyOrders } = require("../controllers/Order.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/create", authMiddleware, createOrder);
router.get("/my-orders", authMiddleware, getMyOrders);

module.exports = router;