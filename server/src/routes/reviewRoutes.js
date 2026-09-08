const express = require("express");

const {
  createReview,
  getShopReviews,
  getProductReviews,
  updateReview,
  deleteReview,
} = require("../controllers/UserReview.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// Create review
router.post("/", authMiddleware, createReview);

// Get all reviews for a shop
router.get("/shop/:shopId", getShopReviews);

// Get all reviews for a product
router.get("/product/:productId", getProductReviews);

// Update own review
router.put("/:reviewId", authMiddleware, updateReview);

// Delete own review
router.delete("/:reviewId", authMiddleware, deleteReview);

module.exports = router;