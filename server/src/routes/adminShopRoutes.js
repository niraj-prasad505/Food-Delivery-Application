const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/owner-auth.middleware");
const {
  createShop,
  getMyShops,
  getShop,
  updateShop,
  updateShopLocation,
  deleteShop,
} = require("../controllers/OwnerShop.controller");

// Authenticate all routes
router.use(authMiddleware);

// Base: /api/owner/shops
router.post("/", createShop);
router.get("/", getMyShops);
router.get("/:id", getShop);

// Update & Toggle Status
router.put("/:id", updateShop);
router.patch("/:id", updateShop);

router.patch("/:id/location", updateShopLocation);
router.delete("/:id", deleteShop);

module.exports = router;