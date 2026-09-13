const Wishlist = require("../models/Wishlist-model");
const Product = require("../models/Product-model");

// ADD PRODUCT TO WISHLIST
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }

        // Check product exists
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // Find user's wishlist
        let wishlist = await Wishlist.findOne({
            user: req.user.id,
        });

        // Create new wishlist
        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: req.user.id,
                items: [productId],
            });

            return res.status(201).json({
                success: true,
                message: "Product added to wishlist",
                wishlist,
            });
        }

        // Check if product already exists
        const alreadyExists = wishlist.items.some(
            (item) => item.toString() === productId
        );

        if (alreadyExists) {
            return res.status(400).json({
                success: false,
                message: "Product already exists in wishlist",
            });
        }

        // Add product
        wishlist.items.push(productId);

        await wishlist.save();

        res.status(200).json({
            success: true,
            message: "Product added to wishlist",
            wishlist,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add product to wishlist",
            error: error.message,
        });
    }
};


// GET WISHLIST
const getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({
            user: req.user.id,
        }).populate({
            path: "items",
            select: "name images price discount category stock rating",
        });

        if (!wishlist) {
            return res.status(200).json({
                success: true,
                message: "Wishlist is empty",
                wishlist: {
                    items: [],
                },
            });
        }

        res.status(200).json({
            success: true,
            wishlist,
        });
    } catch (error) {
        console.error(
            "GET WISHLIST ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to get wishlist",
            error: error.message,
        });
    }
};


// REMOVE PRODUCT FROM WISHLIST
const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        const wishlist = await Wishlist.findOne({
            user: req.user.id,
        });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found",
            });
        }

        const productExists = wishlist.items.some(
            (item) =>
                item.toString() === productId
        );

        if (!productExists) {
            return res.status(404).json({
                success: false,
                message:
                    "Product is not in wishlist",
            });
        }

        wishlist.items = wishlist.items.filter(
            (item) =>
                item.toString() !== productId
        );

        await wishlist.save();

        res.status(200).json({
            success: true,
            message:
                "Product removed from wishlist",
            wishlist,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                "Failed to remove product from wishlist",
            error: error.message,
        });
    }
};


// CLEAR WISHLIST
const clearWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({
            user: req.user.id,
        });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found",
            });
        }

        wishlist.items = [];

        await wishlist.save();

        res.status(200).json({
            success: true,
            message:
                "Wishlist cleared successfully",
            wishlist,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to clear wishlist",
            error: error.message,
        });
    }
};


// CHECK PRODUCT IN WISHLIST
const checkWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        const wishlist = await Wishlist.findOne({
            user: req.user.id,
        });

        if (!wishlist) {
            return res.status(200).json({
                success: true,
                exists: false,
            });
        }

        const exists = wishlist.items.some(
            (item) =>
                item.toString() === productId
        );

        res.status(200).json({
            success: true,
            exists,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                "Failed to check wishlist",
            error: error.message,
        });
    }
};


module.exports = {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
    clearWishlist,
    checkWishlist,
};