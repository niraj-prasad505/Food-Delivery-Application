const express = require("express");

const {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
    clearWishlist,
    checkWishlist,
} = require("../controllers/UserWishlist.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
    "/add",
    authMiddleware,
    addToWishlist
);

router.get(
    "/",
    authMiddleware,
    getWishlist
);

router.delete(
    "/remove/:productId",
    authMiddleware,
    removeFromWishlist
);

router.delete(
    "/clear",
    authMiddleware,
    clearWishlist
);

router.get(
    "/check/:productId",
    authMiddleware,
    checkWishlist
);

module.exports = router;