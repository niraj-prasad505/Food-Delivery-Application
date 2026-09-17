const mongoose = require("mongoose");
const Order = require("../models/Order-model");
const Shop = require("../models/Shop-model");

// Helper to safely extract owner ID from token payload
const getOwnerId = (req) =>
  req.owner?._id || req.owner?.id || req.owner?.ownerId || (typeof req.owner === "string" ? req.owner : null);

// ==========================================
// GET ALL ORDERS ACROSS OWNER'S OUTLETS
// ==========================================
const getMyOrders = async (req, res) => {
  try {
    const ownerId = getOwnerId(req);

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid owner identity",
      });
    }

    // 1. Find all active shops belonging to this owner
    const shops = await Shop.find({ owner: ownerId, deletedAt: null }).select("_id");
    const shopIds = shops.map((s) => s._id);

    if (shopIds.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        orders: [],
      });
    }

    // 2. Query filters
    const { status, shopId, search } = req.query;
    const filter = { shop: { $in: shopIds } };

    if (status && status !== "all") {
      filter.status = status.toLowerCase();
    }

    if (shopId && mongoose.Types.ObjectId.isValid(shopId)) {
      filter.shop = shopId;
    }

    const orders = await Order.find(filter)
      .populate("user", "name email phone")
      .populate("shop", "name city phone")
      .populate("items.product", "name images price category")
      .sort({ createdAt: -1 });

    // Client-side search fallback across populated fields
    let result = orders;
    if (search) {
      const q = search.trim().toLowerCase();
      result = orders.filter(
        (ord) =>
          ord._id.toString().includes(q) ||
          ord.user?.name?.toLowerCase().includes(q) ||
          ord.user?.phone?.includes(q) ||
          ord.shop?.name?.toLowerCase().includes(q)
      );
    }

    return res.status(200).json({
      success: true,
      count: result.length,
      orders: result,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve orders",
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE ORDER DETAILS
// ==========================================
const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = getOwnerId(req);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format",
      });
    }

    const order = await Order.findById(id)
      .populate("user", "name email phone")
      .populate("shop", "name city phone address owner")
      .populate("items.product", "name images price category");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Verify order belongs to a store owned by the requester
    if (order.shop?.owner?.toString() !== ownerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to access this order",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order details error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve order details",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE ORDER PREPARATION / DELIVERY STATUS
// ==========================================
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const ownerId = getOwnerId(req);

    const validStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ];

    if (!status || !validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Choose from: ${validStatuses.join(", ")}`,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format",
      });
    }

    const existingOrder = await Order.findById(id).populate("shop", "owner");

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (existingOrder.shop?.owner?.toString() !== ownerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You do not own the outlet for this order",
      });
    }

    existingOrder.status = status.toLowerCase();

    // Auto-mark payment as paid if delivered and payment method was COD
    if (existingOrder.status === "delivered" && existingOrder.paymentMethod === "cod") {
      existingOrder.paymentStatus = "paid";
    }

    await existingOrder.save();

    const updated = await Order.findById(id)
      .populate("user", "name email phone")
      .populate("shop", "name city phone")
      .populate("items.product", "name images price category");

    return res.status(200).json({
      success: true,
      message: `Order status changed to ${status}`,
      order: updated,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE PAYMENT STATUS
// ==========================================
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;
    const ownerId = getOwnerId(req);

    const validPaymentStatuses = ["pending", "paid", "failed", "refunded"];

    if (!paymentStatus || !validPaymentStatuses.includes(paymentStatus.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid payment status. Choose from: ${validPaymentStatuses.join(", ")}`,
      });
    }

    const order = await Order.findById(id).populate("shop", "owner");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.shop?.owner?.toString() !== ownerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to modify this order",
      });
    }

    order.paymentStatus = paymentStatus.toLowerCase();
    await order.save();

    return res.status(200).json({
      success: true,
      message: `Payment status updated to ${paymentStatus}`,
      order,
    });
  } catch (error) {
    console.error("Update payment status error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update payment status",
      error: error.message,
    });
  }
};

module.exports = {
  getMyOrders,
  getOrder,
  updateOrderStatus,
  updatePaymentStatus,
};