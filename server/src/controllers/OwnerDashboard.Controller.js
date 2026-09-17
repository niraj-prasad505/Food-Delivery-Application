const { getAdminDashboardData } = require("../controllers/adminDashboardService");

const getAdminDashboard = async (req, res) => {
  try {
    // req.owner is populated by your adminAuthMiddleware
    const ownerId = req.owner._id || req.owner.id || req.owner.ownerId;

    if (!ownerId) {
      return res.status(400).json({
        success: false,
        message: "Owner credentials not found in request context",
      });
    }

    const dashboardData = await getAdminDashboardData(ownerId);

    return res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error fetching admin dashboard data",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminDashboard,
};