const express = require("express");
const router = express.Router();
const { saveUserLocation, getUserLocation } = require("../controllers/UserLocation.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/location", authMiddleware, saveUserLocation);
router.get("/location", authMiddleware, getUserLocation);

module.exports = router;