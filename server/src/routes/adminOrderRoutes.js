const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/owner-auth.middleware");

const {
  getMyOrders,
  getOrder,
  updateOrderStatus,
  updatePaymentStatus,
} = require("../controllers/OwnerOrder.controller");

router.use(authMiddleware);

// Base: /api/owner/orders
router.get("/", getMyOrders);
router.get("/:id", getOrder);
router.patch("/:id/status", updateOrderStatus);
router.patch("/:id/payment", updatePaymentStatus);

module.exports = router;