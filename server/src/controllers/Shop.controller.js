// server/src/controllers/Shop.controller.js
const Shop = require("../models/Shop-model");

// GET /api/shops - Get all active restaurants
const getAllShops = async (req, res) => {
    try {
        const shops = await Shop.find({ isActive: true });
        res.status(200).json({
            success: true,
            shops,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch shops",
            error: error.message,
        });
    }
};

// GET /api/shops/:id - Get single restaurant details
const getShopById = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id);
        if (!shop) {
            return res.status(404).json({
                success: false,
                message: "Shop not found",
            });
        }
        res.status(200).json({
            success: true,
            shop,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch shop details",
            error: error.message,
        });
    }
};

module.exports = {
    getAllShops,
    getShopById,
};