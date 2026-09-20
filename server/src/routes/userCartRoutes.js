const express = require("express");
const router = express.Router();

// Adjust the filename below to match your exact file inside server/src/controllers/
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/UserCart.Controller"); 

const authMiddleware = require("../middleware/auth.middleware");

router.get("/", authMiddleware, getCart);
router.post("/add", authMiddleware, addToCart);
router.post("/update", authMiddleware, updateCartItem);
router.delete("/remove/:productId", authMiddleware, removeFromCart);
router.delete("/clear", authMiddleware, clearCart);

module.exports = router;