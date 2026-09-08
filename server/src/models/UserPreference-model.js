const mongoose = require("mongoose");

const userPreferenceSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        favoriteFoods: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Food"
            }
        ],

        dietaryPreference: {
            type: String,
            enum: ["veg", "non-veg", "vegan", "none"],
            default: "none"
        },

        preferredCategories: [
            {
                type: String
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "UserPreference",
    userPreferenceSchema
);