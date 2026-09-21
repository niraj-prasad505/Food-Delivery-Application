// server/src/models/UserLocation-model.js
const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  label: {
    type: String,
    enum: ["Home", "Work", "Other"],
    default: "Home",
  },
  houseNo: { type: String, default: "" },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, default: "" },
  pincode: { type: String, required: true },
  formattedAddress: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const userLocationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    addresses: [addressSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UserLocation", userLocationSchema);