const {
    getAdminDashboardData,
} = require("./adminDashboardService");

const getAdminDashboard = async (req, res) => {
    try {
        const dashboardData = await getAdminDashboardData();

        res.status(200).json({
            success: true,
            data: dashboardData,
        });
    } catch (error) {
        console.error("Admin Dashboard Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch admin dashboard data",
        });
    }
};

module.exports = {
    getAdminDashboard,
};