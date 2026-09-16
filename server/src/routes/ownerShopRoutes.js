const express = require("express");

const {
    createShop,
    getMyShops,
    getShop,
    updateShop,
    updateShopLocation,
    deleteShop,
    getAllShopsPublic,
} = require("../controllers/OwnerShop.controller");

const ownerAuth = require("../middleware/owner-auth.middleware");

const router = express.Router();


// PUBLIC

router.get("/public", getAllShopsPublic);


// OWNER

// Create shop
router.post("/", ownerAuth, createShop);

// Get all shops of logged-in owner
router.get("/", ownerAuth, getMyShops);

// Get one shop
router.get("/:id", ownerAuth, getShop);

// Update shop
router.patch("/:id", ownerAuth, updateShop);

// Update shop location
router.patch("/:id/location", ownerAuth, updateShopLocation);

// Delete shop
router.delete("/:id", ownerAuth, deleteShop);


module.exports = router;