const Shop = require("../models/Shop-model");


// ==========================================
// CREATE SHOP
// ==========================================

const createShop = async (req, res) => {
    try {
        const {
            name,
            description,
            phone,
            address,
            city,
            deliveryRadiusKm,
            icon,
            images,
        } = req.body;

        // Required fields
        if (!name || !phone || !address || !city) {
            return res.status(400).json({
                success: false,
                message: "Name, phone, address and city are required",
            });
        }

        const shop = await Shop.create({
            owner: req.owner.id,
            name,
            description,
            phone,
            address,
            city,
            deliveryRadiusKm,
            icon,
            images,
        });

        return res.status(201).json({
            success: true,
            message: "Shop created successfully",
            shop,
        });

    } catch (error) {
        console.error("Create shop error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create shop",
            error: error.message,
        });
    }
};


// ==========================================
// GET MY SHOPS
// ==========================================

const getMyShops = async (req, res) => {
    try {
        const shops = await Shop.find({
            owner: req.owner.id,
            deletedAt: null,
        }).sort({
            createdAt: -1,
        });

        return res.status(200).json({
            success: true,
            count: shops.length,
            shops,
        });

    } catch (error) {
        console.error("Get shops error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get shops",
            error: error.message,
        });
    }
};


// ==========================================
// GET ONE SHOP
// ==========================================

const getShop = async (req, res) => {
    try {
        const { id } = req.params;

        const shop = await Shop.findOne({
            _id: id,
            owner: req.owner.id,
            deletedAt: null,
        });

        if (!shop) {
            return res.status(404).json({
                success: false,
                message: "Shop not found",
            });
        }

        return res.status(200).json({
            success: true,
            shop,
        });

    } catch (error) {
        console.error("Get shop error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get shop",
            error: error.message,
        });
    }
};


// ==========================================
// UPDATE SHOP
// ==========================================

const updateShop = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            description,
            phone,
            address,
            city,
            deliveryRadiusKm,
            icon,
            images,
            isOpen,
            isActive,
        } = req.body;

        const updateData = {};

        // Only update fields that were provided
        if (name !== undefined) {
            updateData.name = name;
        }

        if (description !== undefined) {
            updateData.description = description;
        }

        if (phone !== undefined) {
            updateData.phone = phone;
        }

        if (address !== undefined) {
            updateData.address = address;
        }

        if (city !== undefined) {
            updateData.city = city;
        }

        if (deliveryRadiusKm !== undefined) {
            updateData.deliveryRadiusKm = deliveryRadiusKm;
        }

        if (icon !== undefined) {
            updateData.icon = icon;
        }

        if (images !== undefined) {
            updateData.images = images;
        }

        if (isOpen !== undefined) {
            updateData.isOpen = isOpen;
        }

        if (isActive !== undefined) {
            updateData.isActive = isActive;
        }

        const shop = await Shop.findOneAndUpdate(
            {
                _id: id,
                owner: req.owner.id,
                deletedAt: null,
            },
            {
                $set: updateData,
            },
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

        return res.status(200).json({
            success: true,
            message: "Shop updated successfully",
            shop,
        });

    } catch (error) {
        console.error("Update shop error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update shop",
            error: error.message,
        });
    }
};


// ==========================================
// UPDATE SHOP LOCATION
// ==========================================

const updateShopLocation = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;

        // Validate coordinates
        if (
            typeof latitude !== "number" ||
            typeof longitude !== "number"
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid latitude and longitude are required",
            });
        }

        if (
            latitude < -90 ||
            latitude > 90 ||
            longitude < -180 ||
            longitude > 180
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid latitude or longitude",
            });
        }

        const shop = await Shop.findOne({
            _id: req.params.id,
            owner: req.owner.id,
            deletedAt: null,
        });

        if (!shop) {
            return res.status(404).json({
                success: false,
                message: "Shop not found",
            });
        }

        // GeoJSON format:
        // [longitude, latitude]
        shop.location = {
            type: "Point",
            coordinates: [
                longitude,
                latitude,
            ],
        };

        await shop.save();

        return res.status(200).json({
            success: true,
            message: "Shop location updated successfully",
            shop,
        });

    } catch (error) {
        console.error("Update location error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update shop location",
            error: error.message,
        });
    }
};


// ==========================================
// DELETE SHOP - SOFT DELETE
// ==========================================

const deleteShop = async (req, res) => {
    try {
        const shop = await Shop.findOneAndUpdate(
            {
                _id: req.params.id,
                owner: req.owner.id,
                deletedAt: null,
            },
            {
                $set: {
                    deletedAt: new Date(),
                    isActive: false,
                    isOpen: false,
                },
            },
            {
                new: true,
            }
        );

        if (!shop) {
            return res.status(404).json({
                success: false,
                message: "Shop not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Shop deleted successfully",
        });

    } catch (error) {
        console.error("Delete shop error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete shop",
            error: error.message,
        });
    }
};


// ==========================================
// GET PUBLIC SHOPS
// ==========================================

const getAllShopsPublic = async (req, res) => {
    try {
        const shops = await Shop.find({
            isActive: true,
            deletedAt: null,
        }).sort({
            createdAt: -1,
        });

        return res.status(200).json({
            success: true,
            count: shops.length,
            shops,
        });

    } catch (error) {
        console.error("Get public shops error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch restaurants",
            error: error.message,
        });
    }
};


// ==========================================
// EXPORTS
// ==========================================

module.exports = {
    createShop,
    getMyShops,
    getShop,
    updateShop,
    updateShopLocation,
    deleteShop,
    getAllShopsPublic,
};