const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Owner",
            required: false,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
            default: "",
        },

        icon: {
            type: String,
            default: "",
        },

        // Friend's client feature
        banner: {
            type: String,
            default: "",
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

        // Friend's client features
        tags: [
            {
                type: String,
            },
        ],

        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },

        reviewsCount: {
            type: Number,
            default: 0,
        },

        deliveryTime: {
            type: String,
            default: "20–30 mins",
        },

        minOrder: {
            type: Number,
            default: 199,
            min: 0,
        },

        freeDelivery: {
            type: Boolean,
            default: true,
        },

        // Location / delivery feature
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },

            coordinates: {
                type: [Number],
                default: [91.8687, 24.8949],
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

        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

shopSchema.index({ location: "2dsphere" });

module.exports =
    mongoose.models.Shop ||
    mongoose.model("Shop", shopSchema);