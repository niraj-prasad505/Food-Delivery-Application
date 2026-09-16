const {
    getAdminDashboardData,
} = require("./adminDashboardService");

const getAdminDashboard = async (req, res) => {
    try {
        const ownerId = req.owner._id;

        const dashboardData =
            await getAdminDashboardData(ownerId);

        res.status(200).json({
            success: true,
            data: dashboardData,
        });
    } catch (error) {
        console.error("Admin Dashboard Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard data",
        });
    }
};

module.exports = {
    getAdminDashboard,
};