// server/src/routes/productRoutes.js
const express = require("express");
const router = express.Router();
const { getAllProducts, getProductById } = require("../controllers/Product.controller");

// Public routes for customers
router.get("/", getAllProducts);
router.get("/:id", getProductById);

module.exports = router;