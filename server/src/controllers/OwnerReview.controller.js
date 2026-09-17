const mongoose = require("mongoose");
const Review = require("../models/Review-model");
const Shop = require("../models/Shop-model");

// Helper to safely extract owner ID from token payload
const getOwnerId = (req) =>
  req.owner?._id || req.owner?.id || req.owner?.ownerId || (typeof req.owner === "string" ? req.owner : null);

// ==========================================
// GET ALL REVIEWS ACROSS OWNER'S OUTLETS
// ==========================================
const getMyReviews = async (req, res) => {
  try {
    const ownerId = getOwnerId(req);

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid owner session",
      });
    }

    // 1. Get all active shop IDs owned by this admin
    const shops = await Shop.find({ owner: ownerId, deletedAt: null }).select("_id");
    const shopIds = shops.map((s) => s._id);

    if (shopIds.length === 0) {
      return res.status(200).json({
        success: true,
        stats: {
          averageRating: 0,
          totalReviews: 0,
          breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        },
        reviews: [],
      });
    }

    // 2. Query filters
    const { shopId, rating, search } = req.query;
    const filter = { shop: { $in: shopIds } };

    if (shopId && mongoose.Types.ObjectId.isValid(shopId)) {
      filter.shop = shopId;
    }

    if (rating && !isNaN(rating) && Number(rating) >= 1 && Number(rating) <= 5) {
      filter.rating = Number(rating);
    }

    // 3. Parallel Execution: Aggregated Rating Stats + Detailed Reviews
    const [reviews, statsAgg] = await Promise.all([
      Review.find(filter)
        .populate("user", "name email")
        .populate("shop", "name city")
        .populate("product", "name images price category")
        .sort({ createdAt: -1 })
        .lean(),

      Review.aggregate([
        { $match: { shop: { $in: shopIds } } },
        {
          $group: {
            _id: "$rating",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    // Calculate rating distribution and average
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalScore = 0;
    let totalReviews = 0;

    statsAgg.forEach((item) => {
      const star = item._id;
      if (breakdown[star] !== undefined) {
        breakdown[star] = item.count;
      }
      totalScore += star * item.count;
      totalReviews += item.count;
    });

    const averageRating = totalReviews > 0 ? (totalScore / totalReviews).toFixed(1) : "0.0";

    // Client-side search across user names, comments, and dishes
    let result = reviews;
    if (search) {
      const q = search.trim().toLowerCase();
      result = reviews.filter(
        (r) =>
          r.comment?.toLowerCase().includes(q) ||
          r.user?.name?.toLowerCase().includes(q) ||
          r.product?.name?.toLowerCase().includes(q) ||
          r.shop?.name?.toLowerCase().includes(q)
      );
    }

    return res.status(200).json({
      success: true,
      stats: {
        averageRating: Number(averageRating),
        totalReviews,
        breakdown,
      },
      reviews: result,
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch customer reviews",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE / MODERATE REVIEW
// ==========================================
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = getOwnerId(req);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID format",
      });
    }

    const review = await Review.findById(id).populate("shop", "owner");

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Verify ownership of the store this review was posted on
    if (review.shop?.owner?.toString() !== ownerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You do not own the outlet this review belongs to",
      });
    }

    await Review.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Review removed successfully",
    });
  } catch (error) {
    console.error("Delete review error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove review",
      error: error.message,
    });
  }
};

module.exports = {
  getMyReviews,
  deleteReview,
};