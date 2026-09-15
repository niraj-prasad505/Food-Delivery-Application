// server/src/routes/shopRoutes.js
const express = require("express");
const router = express.Router();
const { getAllShops, getShopById } = require("../controllers/Shop.controller");

// Public routes for customers
router.get("/", getAllShops);
router.get("/:id", getShopById);

module.exports = router;