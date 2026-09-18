const Order = require("../models/Order.model");

// Create new order & clear cart
exports.createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod, subtotal, deliveryFee, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const newOrder = await Order.create({
      user: req.user._id,
      items,
      deliveryAddress,
      paymentMethod,
      subtotal,
      deliveryFee,
      totalAmount,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ success: false, message: "Failed to place order" });
  }
};

// Get all orders for logged-in user
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get My Orders Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};