const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        shop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shop",
            required: true,
        },

        restaurant: {
            type: String,
            required: false,
            trim: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        images: {
            type: [String],
            required: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        originalPrice: {
            type: Number,
            default: 0,
            min: 0,
        },

        discount: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        longDescription: {
            type: String,
            trim: true,
            default: "",
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        cuisine: {
            type: String,
            default: "General",
            trim: true,
        },

        ingredients: {
            type: String,
            default: "",
            trim: true,
        },

        reviews: {
            type: String,
            default: "",
        },

        deliveryTime: {
            type: String,
            default: "20–30 min",
        },

        stock: {
            type: Number,
            default: 0,
            min: 0,
        },

        isTrending: {
            type: Boolean,
            default: false,
        },

        bgcolor: {
            type: String,
            default: "#ffffff",
        },

        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },

        reviewCount: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });

module.exports =
    mongoose.models.Product ||
    mongoose.model("Product", productSchema);