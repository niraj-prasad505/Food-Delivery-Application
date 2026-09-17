const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/owner-auth.middleware");

const {
  getMyReviews,
  deleteReview,
} = require("../controllers/OwnerReview.controller");

router.use(authMiddleware);

// Base: /api/owner/reviews
router.get("/", getMyReviews);
router.delete("/:id", deleteReview);

module.exports = router;