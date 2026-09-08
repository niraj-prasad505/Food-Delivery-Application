const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
    {
        // One owner can create multiple shops
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Owner",
            required: true,
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

        // Shop logo / profile image
        icon: {
            type: String,
        },

        // Shop gallery
        images: [
            {
                type: String,
            },
        ],

        phone: {
            type: String,
            required: true,
            trim: true,
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

        // Added later by owner from the physical shop
        location: {
            type: {
                type: String,
                enum: ["Point"],
            },
            coordinates: {
                type: [Number],
            },
        },

        // Maximum delivery distance
        deliveryRadiusKm: {
            type: Number,
            min: 1,
            max: 50,
            default: 5,
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

// Required for MongoDB nearby-location queries
shopSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Shop", shopSchema);