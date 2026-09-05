const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true, // Only one active OTP per email
        },

        otp: {
            type: String,
            required: true, // Store hashed OTP
        },

        verified: {
            type: Boolean,
            default: false,
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
            index: { expires: 0 }, // MongoDB automatically deletes expired documents
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