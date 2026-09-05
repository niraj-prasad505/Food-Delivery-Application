const mongoose = require("mongoose");

const landingPageSchema = new mongoose.Schema(
    {
        ads: [
            {
                type: String,
            },
        ],

        featuredProducts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Food",
            },
        ],

        recommendedProducts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Food",
            },
        ],

        popularProducts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Food",
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("LandingPage", landingPageSchema);