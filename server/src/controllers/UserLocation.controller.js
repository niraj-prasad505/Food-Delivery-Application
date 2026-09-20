// server/src/controllers/UserLocation.controller.js
const UserLocation = require("../models/UserLocation-model");

// Save or Append Labeled Address
const saveUserLocation = async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      address,
      label,
      houseNo,
      street,
      city,
      state,
      pincode,
      isDefault,
    } = req.body;
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    let userLoc = await UserLocation.findOne({ userId });

    const newAddressObj = {
      label: label || "Home",
      houseNo: houseNo || "",
      street: street || address || "Selected Locality",
      city: city || "City",
      state: state || "",
      pincode: pincode || "000000",
      formattedAddress: address || `${street}, ${city}`,
      isDefault: isDefault !== undefined ? isDefault : true,
    };

    if (!userLoc) {
      userLoc = await UserLocation.create({
        userId,
        latitude: latitude || 0,
        longitude: longitude || 0,
        addresses: [newAddressObj],
      });
    } else {
      if (newAddressObj.isDefault) {
        userLoc.addresses.forEach((addr) => (addr.isDefault = false));
      }
      userLoc.latitude = latitude || userLoc.latitude;
      userLoc.longitude = longitude || userLoc.longitude;
      userLoc.addresses.push(newAddressObj);
      await userLoc.save();
    }

    const activeAddress =
      userLoc.addresses.find((a) => a.isDefault) ||
      userLoc.addresses[userLoc.addresses.length - 1];

    res.status(200).json({
      message: "Address saved successfully",
      location: userLoc,
      activeAddress,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch User Addresses
const getUserLocation = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const location = await UserLocation.findOne({ userId });

    const addresses = location?.addresses || [];
    const defaultAddress =
      addresses.find((a) => a.isDefault) || addresses[0] || null;

    res.status(200).json({
      success: true,
      location: location || null,
      addresses,
      defaultAddress,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { saveUserLocation, getUserLocation };