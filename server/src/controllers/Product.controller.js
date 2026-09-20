// server/src/controllers/Product.controller.js
const mongoose = require("mongoose");
const Product = require("../models/Product-model");

// GET /api/foods - Get all food items
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate("shop");
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// GET /api/foods/:id - Get single food product details
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Guard against invalid/mock IDs (e.g. "m1", "m8") crashing MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "Invalid product ID or product not found",
      });
    }

    const product = await Product.findById(id).populate("shop");
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product details",
      error: error.message,
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
};