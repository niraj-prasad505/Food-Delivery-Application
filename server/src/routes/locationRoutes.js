const express = require("express");

const router = express.Router();

const {saveUserLocation} = require("../controllers/UserLocation.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.post("/location", authMiddleware, saveUserLocation);

module.exports = router;