const Order = require("../models/Order-model");
const Shop = require("../models/Shop-model");
const Product = require("../models/Product-model");

const getAdminDashboardData = async () => {
    const [
        totalOrders,
        totalShops,
        totalProducts,
        revenueResult,
    ] = await Promise.all([
        Order.countDocuments(),

        Shop.countDocuments(),

        Product.countDocuments(),

        Order.aggregate([
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$amount",
                    },
                },
            },
        ]),
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

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

        ordersOverview: [],

        recentOrders: [],

        topProducts: [],
    };
};

module.exports = {
    getAdminDashboardData,
};