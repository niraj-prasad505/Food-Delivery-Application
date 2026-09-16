const Order = require("../models/Order-model");
const Shop = require("../models/Shop-model");
const Product = require("../models/Product-model");

const getAdminDashboardData = async (ownerId) => {
    // 1. Find all shops belonging to this owner
    const shops = await Shop.find({
        owner: ownerId,
    }).select("_id");

    const shopIds = shops.map((shop) => shop._id);

    // 2. Fetch dashboard data for those shops
    const [
        totalOrders,
        totalShops,
        totalProducts,
        revenueResult,
        ordersOverview,
    ] = await Promise.all([
        // Total orders from owner's shops
        Order.countDocuments({
            shop: { $in: shopIds },
        }),

        // Total shops owned by owner
        Shop.countDocuments({
            shop: ownerId,
        }),

        // Total products
        Product.countDocuments({
            shop: { $in: shopIds },
        }),

        // Total revenue from owner's orders
        Order.aggregate([
            {
                $match: {
                    shop: { $in: shopIds },
                },
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$totalAmount",
                    },
                },
            },
        ]),

        // Orders for last 7 days
        Order.aggregate([
            {
                $match: {
                    shop: { $in: shopIds },
                    createdAt: {
                        $gte: new Date(
                            Date.now() -
                            7 * 24 * 60 * 60 * 1000
                        ),
                    },
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
                    value: {
                        $sum: 1,
                    },
                },
            },
            {
                $sort: {
                    _id: 1,
                },
            },
        ]),
    ]);

    const totalRevenue =
        revenueResult[0]?.total || 0;

    const formattedOrdersOverview =
        ordersOverview.map((item) => ({
            label: item._id,
            value: item.value,
        }));

    return {
        stats: {
            orders: {
                value: totalOrders,
            },

            shops: {
                value: totalShops,
            },

            products: {
                value: totalProducts,
            },

            revenue: {
                value: totalRevenue,
            },
        },

        ordersOverview: formattedOrdersOverview,

        recentOrders: [],

        topProducts: [],
    };
};

module.exports = {
    getAdminDashboardData,
};