const express = require("express");

const {
    getAdminDashboard,
} = require("../controllers/OwnerDashboard.Controller");

const adminAuthMiddleware = require("../middleware/owner-auth.middleware");

const router = express.Router();

router.get(
    "/dashboard",
    adminAuthMiddleware,
    getAdminDashboard
);

module.exports = router;