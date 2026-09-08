const Review = require("../models/Review-model");
const Product = require("../models/Product-model");
const Shop = require("../models/Shop-model");

// Create a review
const createReview = async (req, res) => {
  try {
    const { shop, product, rating, comment } = req.body;

    // Basic validation
    if (!shop || !rating) {
      return res.status(400).json({
        message: "Shop and rating are required",
      });
    }

    // Rating validation
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    // Check shop exists
    const shopExists = await Shop.findById(shop);

    if (!shopExists) {
      return res.status(404).json({
        message: "Shop not found",
      });
    }

    // If product review, verify product belongs to this shop
    if (product) {
      const productExists = await Product.findOne({
        _id: product,
        shop: shop,
      });

      if (!productExists) {
        return res.status(404).json({
          message: "Product not found in this shop",
        });
      }
    }

    // Create review
    const review = await Review.create({
      user: req.user.id,
      shop,
      product: product || null,
      rating,
      comment: comment || null,
    });

    return res.status(201).json({
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    // Duplicate review
    if (error.code === 11000) {
      return res.status(409).json({
        message: "You have already reviewed this product",
      });
    }

    console.error("Create review error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// Get reviews of a shop
const getShopReviews = async (req, res) => {
  try {
    const { shopId } = req.params;

    const reviews = await Review.find({ shop: shopId })
      .populate("user", "name")
      .populate("product", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get shop reviews error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// Get reviews of a product
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({
      product: productId,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get product reviews error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// Update own review
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findOne({
      _id: reviewId,
      user: req.user.id,
    });

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          message: "Rating must be between 1 and 5",
        });
      }

      review.rating = rating;
    }

    if (comment !== undefined) {
      review.comment = comment;
    }

    await review.save();

    return res.status(200).json({
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    console.error("Update review error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// Delete own review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findOneAndDelete({
      _id: reviewId,
      user: req.user.id,
    });

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    return res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete review error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  createReview,
  getShopReviews,
  getProductReviews,
  updateReview,
  deleteReview,
};