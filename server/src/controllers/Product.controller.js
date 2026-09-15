// server/src/controllers/Product.controller.js
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
        const product = await Product.findById(req.params.id).populate("shop");
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