const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/owner-auth.middleware");
const { getMyRevenueAnalytics } = require("../controllers/OwnerRevenue.controller");

router.use(authMiddleware);

// GET /api/owner/revenue
router.get("/", getMyRevenueAnalytics);

module.exports = router;