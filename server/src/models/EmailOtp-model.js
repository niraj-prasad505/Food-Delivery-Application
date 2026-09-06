const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true,
        },

        otp: {
            type: String,
            required: true,
        },

        purpose: {
            type: String,
            enum: ["register", "login"],
            required: true,
        },

        attempts: {
            type: Number,
            default: 0,
            max: 4,
        },

        otpSentCount: {
            type: Number,
            default: 1,
        },

        lastSentAt: {
            type: Date,
            default: Date.now,
        },

        expiresAt: {
            type: Date,
            required: true,
            index: { expires: 0 },
        },

        ipAddress: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("OTP", otpSchema);