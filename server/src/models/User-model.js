const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    contact: {
        type: Number,
        trim: true
    },
    picture: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        enum: ["user", "owner"],
        default: "user"
    },

    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],

    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order"
        }
    ],

    gender: {
        type: String,
        enum: ["male", "female", "other"],
    },

    dob: {
        type: Date,
    },

    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    },

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);