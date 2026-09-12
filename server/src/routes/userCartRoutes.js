const express = require("express");

const router = express.Router();

const {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart,
    clearCart,
} = require("../controllers/UserCart.Controller");

const authMiddleware = require("../middleware/auth.middleware");


router.post("/add", authMiddleware, addToCart);

router.get("/", authMiddleware, getCart);

router.patch("/update", authMiddleware, updateCartItem);

router.delete("/remove/:productId", authMiddleware, removeFromCart);

router.delete("/clear", authMiddleware, clearCart);


module.exports = router;