const mongoose = require("mongoose");
const Order = require("../models/Order.model");
const Shop = require("../models/Shop-model");

const getOwnerId = (req) =>
  req.owner?._id || req.owner?.id || req.owner?.ownerId || (typeof req.owner === "string" ? req.owner : null);

// ==========================================
// GET REVENUE ANALYTICS & TRANSACTIONS
// ==========================================
const getMyRevenueAnalytics = async (req, res) => {
  try {
    const ownerId = getOwnerId(req);

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid owner identity",
      });
    }

    // 1. Fetch active shops owned by the requester
    const shops = await Shop.find({ owner: ownerId, deletedAt: null }).select("_id name city");
    const shopIds = shops.map((s) => s._id);

    if (shopIds.length === 0) {
      return res.status(200).json({
        success: true,
        stats: {
          totalRevenue: "₹0",
          realizedEarnings: "₹0",
          pendingSettlement: "₹0",
          avgOrderValue: "₹0",
          totalOrdersCount: 0,
        },
        chartData: [],
        paymentMethodBreakdown: { online: 0, cod: 0 },
        transactions: [],
      });
    }

    const { timeframe = "7d", shopId } = req.query;
    const baseMatch = { shop: { $in: shopIds }, status: { $ne: "cancelled" } };

    if (shopId && mongoose.Types.ObjectId.isValid(shopId)) {
      baseMatch.shop = new mongoose.Types.ObjectId(shopId);
    }

    const daysCount = timeframe === "30d" ? 30 : 7;
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - daysCount);

    // 2. Parallel Database Aggregations
    const [totalsAgg, chartAgg, paymentMethodAgg, recentTransactions] = await Promise.all([
      // Gross, Realized (Paid), and Pending revenue
      Order.aggregate([
        { $match: baseMatch },
        {
          $group: {
            _id: null,
            totalGross: { $sum: "$totalAmount" },
            paidTotal: {
              $sum: {
                $cond: [{ $eq: ["$paymentStatus", "paid"] }, "$totalAmount", 0],
              },
            },
            pendingTotal: {
              $sum: {
                $cond: [{ $eq: ["$paymentStatus", "pending"] }, "$totalAmount", 0],
              },
            },
            totalOrders: { $sum: 1 },
          },
        },
      ]),

      // Daily revenue timeline
      Order.aggregate([
        {
          $match: {
            ...baseMatch,
            createdAt: { $gte: dateLimit },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%d %b",
                date: "$createdAt",
                timezone: "Asia/Kolkata",
              },
            },
            revenue: { $sum: "$totalAmount" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Payment method share (COD vs Online)
      Order.aggregate([
        { $match: baseMatch },
        {
          $group: {
            _id: "$paymentMethod",
            count: { $sum: 1 },
            amount: { $sum: "$totalAmount" },
          },
        },
      ]),

      // Recent payment settlements/transactions
      Order.find(baseMatch)
        .sort({ createdAt: -1 })
        .limit(15)
        .populate("user", "name email phone")
        .populate("shop", "name city")
        .select("_id user shop totalAmount status paymentStatus paymentMethod createdAt")
        .lean(),
    ]);

    // 3. Format Stats
    const metrics = totalsAgg[0] || { totalGross: 0, paidTotal: 0, pendingTotal: 0, totalOrders: 0 };
    const avgOrderValue = metrics.totalOrders > 0 ? Math.round(metrics.totalGross / metrics.totalOrders) : 0;

    // Payment methods map
    const paymentMethods = { online: 0, cod: 0 };
    paymentMethodAgg.forEach((pm) => {
      if (pm._id === "online" || pm._id === "cod") {
        paymentMethods[pm._id] = pm.amount;
      }
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalRevenue: `₹${metrics.totalGross.toLocaleString("en-IN")}`,
        realizedEarnings: `₹${metrics.paidTotal.toLocaleString("en-IN")}`,
        pendingSettlement: `₹${metrics.pendingTotal.toLocaleString("en-IN")}`,
        avgOrderValue: `₹${avgOrderValue.toLocaleString("en-IN")}`,
        totalOrdersCount: metrics.totalOrders,
      },
      chartData: chartAgg.map((item) => ({
        date: item._id,
        revenue: item.revenue,
        orders: item.orders,
      })),
      paymentMethodBreakdown: paymentMethods,
      transactions: recentTransactions.map((t) => ({
        id: `#${t._id.toString().slice(-6).toUpperCase()}`,
        rawId: t._id,
        customer: t.user?.name || "Customer",
        shopName: t.shop?.name || "Outlet",
        amount: `₹${t.totalAmount.toLocaleString("en-IN")}`,
        rawAmount: t.totalAmount,
        paymentStatus: t.paymentStatus,
        paymentMethod: t.paymentMethod,
        orderStatus: t.status,
        date: new Date(t.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      })),
    });
  } catch (error) {
    console.error("Revenue analytics error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve revenue metrics",
      error: error.message,
    });
  }
};

module.exports = {
  getMyRevenueAnalytics,
};