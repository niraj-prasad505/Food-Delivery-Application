const mongoose = require("mongoose");
const Shop = require("../models/Shop-model");

// Helper to extract owner ID safely from authMiddleware token payload
const getOwnerId = (req) =>
  req.owner?._id || req.owner?.id || req.owner?.ownerId || (typeof req.owner === "string" ? req.owner : null);

// ==========================================
// CREATE NEW SHOP
// ==========================================
const createShop = async (req, res) => {
  try {
    const ownerId = getOwnerId(req);

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Owner identity not found in token",
      });
    }

    const {
      name,
      description,
      phone,
      address,
      city,
      deliveryRadiusKm,
      icon,
      images,
      banner,
      tags,
    } = req.body;

    if (!name || !phone || !address || !city) {
      return res.status(400).json({
        success: false,
        message: "Name, phone, address, and city are required fields",
      });
    }

    const shop = await Shop.create({
      owner: ownerId,
      name: name.trim(),
      description: description ? description.trim() : "",
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      deliveryRadiusKm: deliveryRadiusKm ? Number(deliveryRadiusKm) : 10,
      icon: icon || "",
      banner: banner || "",
      images: Array.isArray(images) ? images : [],
      tags: Array.isArray(tags) ? tags : [],
    });

    return res.status(201).json({
      success: true,
      message: "Shop created successfully",
      shop,
    });
  } catch (error) {
    console.error("Create shop error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create shop",
      error: error.message,
    });
  }
};

// ==========================================
// GET ALL SHOPS FOR LOGGED-IN OWNER
// ==========================================
const getMyShops = async (req, res) => {
  try {
    const ownerId = getOwnerId(req);

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid owner session",
      });
    }

    const shops = await Shop.find({
      owner: ownerId,
      deletedAt: null,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: shops.length,
      shops,
    });
  } catch (error) {
    console.error("Get shops error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get shops",
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE SHOP BY ID
// ==========================================
const getShop = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = getOwnerId(req);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid shop ID format",
      });
    }

    const shop = await Shop.findOne({
      _id: id,
      owner: ownerId,
      deletedAt: null,
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found or access denied",
      });
    }

    return res.status(200).json({
      success: true,
      shop,
    });
  } catch (error) {
    console.error("Get shop error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get shop",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE SHOP DETAILS & STATUS TOGGLE
// ==========================================
const updateShop = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = getOwnerId(req);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid shop ID format",
      });
    }

    const existingShop = await Shop.findOne({ _id: id, deletedAt: null });

    if (!existingShop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found or deleted",
      });
    }

    // Check ownership only if shop has an assigned owner
    if (
      existingShop.owner &&
      ownerId &&
      existingShop.owner.toString() !== ownerId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You do not own this shop",
      });
    }

    const {
      name,
      description,
      phone,
      address,
      city,
      deliveryRadiusKm,
      icon,
      banner,
      images,
      tags,
      isOpen,
      isActive,
    } = req.body;

    const updateData = {};

    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (phone !== undefined) updateData.phone = phone.trim();
    if (address !== undefined) updateData.address = address.trim();
    if (city !== undefined) updateData.city = city.trim();
    if (deliveryRadiusKm !== undefined) updateData.deliveryRadiusKm = Number(deliveryRadiusKm);
    if (icon !== undefined) updateData.icon = icon;
    if (banner !== undefined) updateData.banner = banner;
    if (images !== undefined) updateData.images = Array.isArray(images) ? images : [];
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : [];
    if (isOpen !== undefined) updateData.isOpen = Boolean(isOpen);
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    if (!existingShop.owner && ownerId) {
      updateData.owner = ownerId;
    }

    const updatedShop = await Shop.findByIdAndUpdate(
      id,
      { $set: updateData },
      { returnDocument: "after", runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Shop updated successfully",
      shop: updatedShop,
    });
  } catch (error) {
    console.error("Update shop error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update shop",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE SHOP GEOLOCATION
// ==========================================
const updateShopLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { latitude, longitude } = req.body;
    const ownerId = getOwnerId(req);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid shop ID format",
      });
    }

    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid numeric latitude (-90 to 90) and longitude (-180 to 180) are required",
      });
    }

    const shop = await Shop.findOne({
      _id: id,
      owner: ownerId,
      deletedAt: null,
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found or access denied",
      });
    }

    shop.location = {
      type: "Point",
      coordinates: [longitude, latitude],
    };

    await shop.save();

    return res.status(200).json({
      success: true,
      message: "Shop location updated successfully",
      shop,
    });
  } catch (error) {
    console.error("Update location error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update shop location",
      error: error.message,
    });
  }
};

// ==========================================
// SOFT DELETE SHOP
// ==========================================
const deleteShop = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = getOwnerId(req);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid shop ID format",
      });
    }

    const shop = await Shop.findOneAndUpdate(
      {
        _id: id,
        owner: ownerId,
        deletedAt: null,
      },
      {
        $set: {
          deletedAt: new Date(),
          isActive: false,
          isOpen: false,
        },
      },
      { returnDocument: "after" }
    );

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found or access denied",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Shop deleted successfully",
    });
  } catch (error) {
    console.error("Delete shop error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete shop",
      error: error.message,
    });
  }
};

// ==========================================
// GET PUBLIC ACTIVE SHOPS
// ==========================================
const getAllShopsPublic = async (req, res) => {
  try {
    const shops = await Shop.find({
      isActive: true,
      deletedAt: null,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: shops.length,
      shops,
    });
  } catch (error) {
    console.error("Get public shops error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch restaurants",
      error: error.message,
    });
  }
};

module.exports = {
  createShop,
  getMyShops,
  getShop,
  updateShop,
  updateShopLocation,
  deleteShop,
  getAllShopsPublic,
};