const Shop = require("../models/Shop-model");

// Create a new shop
const createShop = async (req, res) => {
    try {
        const {
            name,
            description,
            phone,
            address,
            city,
            deliveryRadiusKm,
        } = req.body;

        const shop = await Shop.create({
            owner: req.owner.id,
            name,
            description,
            phone,
            address,
            city,
            deliveryRadiusKm,
        });

        res.status(201).json({
            success: true,
            message: "Shop created successfully",
            shop,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create shop",
            error: error.message,
        });
    }
};


// Get all shops of logged-in owner
const getMyShops = async (req, res) => {
    try {
        const shops = await Shop.find({
            owner: req.owner.id,
        });

        res.status(200).json({
            success: true,
            shops,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get shops",
            error: error.message,
        });
    }
};


// Get one shop
const getShop = async (req, res) => {
    try {
        const shop = await Shop.findOne({
            _id: req.params.id,
            owner: req.owner.id,
        });

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
            message: "Failed to get shop",
            error: error.message,
        });
    }
};


// Update shop details
const updateShop = async (req, res) => {
    try {
        const shop = await Shop.findOneAndUpdate(
            {
                _id: req.params.id,
                owner: req.owner.id,
            },
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!shop) {
            return res.status(404).json({
                success: false,
                message: "Shop not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Shop updated successfully",
            shop,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update shop",
            error: error.message,
        });
    }
};


// Add / update shop location
const updateShopLocation = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;

        const shop = await Shop.findOne({
            _id: req.params.id,
            owner: req.owner.id,
        });

        if (!shop) {
            return res.status(404).json({
                success: false,
                message: "Shop not found",
            });
        }

        shop.location = {
            type: "Point",
            coordinates: [longitude, latitude],
        };

        await shop.save();

        res.status(200).json({
            success: true,
            message: "Shop location updated successfully",
            shop,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update shop location",
            error: error.message,
        });
    }
};


// Delete shop
const deleteShop = async (req, res) => {
    try {
        const shop = await Shop.findOneAndDelete({
            _id: req.params.id,
            owner: req.owner.id,
        });

        if (!shop) {
            return res.status(404).json({
                success: false,
                message: "Shop not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Shop deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete shop",
            error: error.message,
        });
    }
};


module.exports = {
    createShop,
    getMyShops,
    getShop,
    updateShop,
    updateShopLocation,
    deleteShop,
};

// Get all shops for public listing (Customers)
const getAllShopsPublic = async (req, res) => {
    try {
        // Fetch active/open shops
        const shops = await Shop.find({ isActive: true });

        res.status(200).json({
            success: true,
            shops,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch restaurants",
            error: error.message,
        });
    }
};

// Add to your exports:
module.exports = {
    createShop,
    getMyShops,
    getShop,
    updateShop,
    updateShopLocation,
    deleteShop,
    getAllShopsPublic, // <-- Expose this function
};