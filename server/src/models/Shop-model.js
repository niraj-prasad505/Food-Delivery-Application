const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Owner",
            required: false, // Made optional for seed data
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        icon: {
            type: String,
        },

        banner: {
            type: String,
        },

        images: [
            {
                type: String,
            },
        ],

        phone: {
            type: String,
            trim: true,
            default: "+880 1700-000000",
        },

        address: {
            type: String,
            required: true,
            trim: true,
        },

        city: {
            type: String,
            required: true,
            trim: true,
        },

        tags: [
            {
                type: String,
            },
        ],

        rating: {
            type: Number,
            default: 4.5,
        },

        reviewsCount: {
            type: String,
            default: "500+",
        },

        deliveryTime: {
            type: String,
            default: "20–30 mins",
        },

        minOrder: {
            type: Number,
            default: 199,
        },

        freeDelivery: {
            type: Boolean,
            default: true,
        },

        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number],
                default: [91.8687, 24.8949], // Sylhet default coordinates
            },
        },

        deliveryRadiusKm: {
            type: Number,
            min: 1,
            max: 50,
            default: 10,
        },

        isOpen: {
            type: Boolean,
            default: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

shopSchema.index({ location: "2dsphere" });

module.exports = mongoose.models.Shop || mongoose.model("Shop", shopSchema);