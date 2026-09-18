const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name: { type: String, required: true },
        image: { type: String },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    deliveryAddress: {
      label: { type: String },
      name: { type: String, required: true },
      details: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "upi", "card"],
      required: true,
    },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Order Placed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Order Placed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);