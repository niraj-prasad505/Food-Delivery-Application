const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/owner-auth.middleware");

const {
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/OwnerProfile.controller");

router.use(authMiddleware);

// Base: /api/owner/profile
router.get("/", getProfile);
router.put("/", updateProfile);
router.put("/password", changePassword);

module.exports = router;