const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        shop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shop",
            required: false,
        },

        restaurant: {
            type: String,
            required: true,
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
        },

        discount: {
            type: String,
            default: "",
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        longDescription: {
            type: String,
            trim: true,
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        cuisine: {
            type: String,
            default: "General",
        },

        ingredients: {
            type: String,
            default: "",
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
            default: 100,
            min: 0,
        },

        isTrending: {
            type: Boolean,
            default: false,
        },

        rating: {
            type: Number,
            default: 4.5,
        },

        reviewCount: {
            type: String,
            default: "500+",
        },
    },
    { timestamps: true }
);

productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);
