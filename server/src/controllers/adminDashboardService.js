const Order = require("../models/Order-model");
const Shop = require("../models/Shop-model");
const Product = require("../models/Product-model");

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

/**
 * Deterministic helper to match MongoDB's `%d %b` format (e.g., "17 Sep")
 */
const getLastDaysLabels = (daysCount = 7) => {
  const result = [];
  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const day = String(d.getDate()).padStart(2, "0");
    const month = MONTHS[d.getMonth()];
    result.push(`${day} ${month}`);
  }
  return result;
};

const getAdminDashboardData = async (ownerId) => {
  if (!ownerId) {
    throw new Error("Owner ID is required to fetch dashboard data");
  }

  // 1. Fetch only active, non-deleted shops belonging to this owner
  const shops = await Shop.find({ 
    owner: ownerId, 
    deletedAt: null 
  }).select("_id name");

  const shopIds = shops.map((s) => s._id);
  const totalShops = shops.length;

  // Safe fallback if owner has no registered shops yet
  if (totalShops === 0) {
    return {
      stats: {
        orders: { value: "0", change: "+0%", isPositive: true },
        shops: { value: "0", change: "+0%", isPositive: true },
        products: { value: "0", change: "+0%", isPositive: true },
        revenue: { value: "₹0", change: "+0%", isPositive: true },
      },
      ordersOverview: getLastDaysLabels(7).map((label) => ({ label, value: 0 })),
      recentOrders: [],
      topProducts: [],
    };
  }

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  // 2. Parallel Database Operations
  const [
    totalOrders,
    totalProducts,
    revenueResult,
    ordersLast7Days,
    ordersPrev7Days,
    ordersOverviewAgg,
    recentOrdersDocs,
    topProductsAgg,
  ] = await Promise.all([
    // Total orders across non-deleted shops
    Order.countDocuments({ shop: { $in: shopIds } }),

    // Total products listed in owner's shops
    Product.countDocuments({ shop: { $in: shopIds } }),

    // Total lifetime revenue (excluding cancelled orders)
    Order.aggregate([
      { $match: { shop: { $in: shopIds }, status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),

    // Orders placed in current 7 days
    Order.countDocuments({
      shop: { $in: shopIds },
      createdAt: { $gte: sevenDaysAgo },
    }),

    // Orders placed in previous 7–14 days (for growth %)
    Order.countDocuments({
      shop: { $in: shopIds },
      createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo },
    }),

    // 7-Day daily order volume breakdown
    Order.aggregate([
      {
        $match: {
          shop: { $in: shopIds },
          createdAt: { $gte: sevenDaysAgo },
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
          count: { $sum: 1 },
        },
      },
    ]),

    // 5 Most recent orders
    Order.find({ shop: { $in: shopIds } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name")
      .populate("shop", "name")
      .lean(),

    // Top 5 products by quantity sold
    Order.aggregate([
      { $match: { shop: { $in: shopIds }, status: { $ne: "cancelled" } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          name: { $first: "$items.name" },
          ordersCount: { $sum: "$items.quantity" },
          revenue: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
        },
      },
      { $sort: { ordersCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: {
          path: "$productDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]),
  ]);

  // 3. Format Lifetime Revenue
  const rawRevenue = revenueResult[0]?.total || 0;
  const formattedRevenue =
    rawRevenue >= 100000
      ? `₹${(rawRevenue / 100000).toFixed(2)}L`
      : `₹${rawRevenue.toLocaleString("en-IN")}`;

  // 4. Calculate Orders % Growth
  let orderGrowth = "+0.0";
  if (ordersPrev7Days > 0) {
    const diff = ((ordersLast7Days - ordersPrev7Days) / ordersPrev7Days) * 100;
    orderGrowth = `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}`;
  } else if (ordersLast7Days > 0) {
    orderGrowth = "+100.0";
  }

  // 5. Zero-fill 7-day Chart Data
  const chartLabels = getLastDaysLabels(7);
  const chartMap = new Map();
  ordersOverviewAgg.forEach((item) => chartMap.set(item._id, item.count));

  const formattedOrdersOverview = chartLabels.map((label) => ({
    label,
    value: chartMap.get(label) || 0,
  }));

  // 6. Format Recent Orders
  const formattedRecentOrders = recentOrdersDocs.map((ord) => ({
    id: `#${ord._id.toString().slice(-5).toUpperCase()}`,
    originalId: ord._id,
    customer: ord.user?.name || "Customer",
    shop: ord.shop?.name || "Your Shop",
    amount: `₹${ord.totalAmount.toLocaleString("en-IN")}`,
    status:
      ord.status.charAt(0).toUpperCase() + ord.status.slice(1).replace(/_/g, " "),
    paymentStatus: ord.paymentStatus,
  }));

  // 7. Format Top Products (with fallback to catalog items if 0 sales yet)
  let formattedTopProducts = [];
  if (topProductsAgg.length > 0) {
    formattedTopProducts = topProductsAgg.map((prod, index) => ({
      id: index + 1,
      productId: prod._id,
      name: prod.name,
      category: prod.productDetails?.category || "General",
      orders: prod.ordersCount,
      revenue: `₹${prod.revenue.toLocaleString("en-IN")}`,
      status:
        prod.productDetails?.stock > 0 || prod.productDetails?.stock === undefined
          ? "Active"
          : "Inactive",
    }));
  } else {
    const catalogProducts = await Product.find({ shop: { $in: shopIds } })
      .sort({ rating: -1 })
      .limit(5)
      .lean();

    formattedTopProducts = catalogProducts.map((p, index) => ({
      id: index + 1,
      productId: p._id,
      name: p.name,
      category: p.category || "General",
      orders: 0,
      revenue: `₹${p.price.toLocaleString("en-IN")}`,
      status: p.stock > 0 ? "Active" : "Inactive",
    }));
  }

  return {
    stats: {
      orders: {
        value: totalOrders.toLocaleString("en-IN"),
        change: `${orderGrowth}%`,
        isPositive: !orderGrowth.startsWith("-"),
      },
      shops: {
        value: totalShops.toLocaleString("en-IN"),
        change: "+0%",
        isPositive: true,
      },
      products: {
        value: totalProducts.toLocaleString("en-IN"),
        change: "+0%",
        isPositive: true,
      },
      revenue: {
        value: formattedRevenue,
        change: "+0%",
        isPositive: true,
      },
    },
    ordersOverview: formattedOrdersOverview,
    recentOrders: formattedRecentOrders,
    topProducts: formattedTopProducts,
  };
};

module.exports = {
  getAdminDashboardData,
};