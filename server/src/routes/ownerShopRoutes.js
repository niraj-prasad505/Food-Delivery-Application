const express = require("express");

const {
    createShop,
    getMyShops,
    getShop,
    updateShop,
    updateShopLocation,
    deleteShop,
    getAllShopsPublic, // <-- ADD THIS IMPORT
} = require("../controllers/OwnerShop.controller");

const ownerAuth = require("../middleware/owner-auth.middleware");

const router = express.Router();

// Public endpoint for customers/visitors
router.get("/public", getAllShopsPublic);

router.post("/", ownerAuth, createShop);

router.get("/", ownerAuth, getMyShops);

router.get("/:id", ownerAuth, getShop);

router.patch("/:id", ownerAuth, updateShop);

router.patch("/:id/location", ownerAuth, updateShopLocation);

router.delete("/:id", ownerAuth, deleteShop);

module.exports = router;