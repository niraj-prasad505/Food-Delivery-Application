const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // REQUIRED: Links the order to the restaurant/owner
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: false, // set to false for now so mock/legacy orders without a shop don't crash
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.Mixed,
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
      enum: ["cod", "online"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded", "pending", "paid", "failed", "refunded"],
      default: "Pending",
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "Order Placed",
        "Preparing",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
        "pending",
        "confirmed",
        "preparing",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "Order Placed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);