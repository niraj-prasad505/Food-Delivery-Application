const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Safely resolve the Owner model (adjust filename if named ownerModel.js or Owner-model.js)
let Owner;
try {
  Owner = require("../models/Owner-model");
} catch {
  try {
    Owner = require("../models/ownerModel");
  } catch {
    Owner = mongoose.models.Owner || mongoose.models.User;
  }
}

const getOwnerId = (req) =>
  req.owner?._id || req.owner?.id || req.owner?.ownerId || (typeof req.owner === "string" ? req.owner : null);

// ==========================================
// GET OWNER PROFILE & PREFERENCES
// ==========================================
const getProfile = async (req, res) => {
  try {
    const ownerId = getOwnerId(req);

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid session",
      });
    }

    const owner = await Owner.findById(ownerId).select("-password");

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Owner account not found",
      });
    }

    return res.status(200).json({
      success: true,
      owner,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch account profile",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE PROFILE INFORMATION
// ==========================================
const updateProfile = async (req, res) => {
  try {
    const ownerId = getOwnerId(req);
    const { name, phone } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Full name cannot be blank",
      });
    }

    const updatedOwner = await Owner.findByIdAndUpdate(
      ownerId,
      {
        $set: {
          name: name.trim(),
          ...(phone !== undefined && { phone: phone.trim() }),
        },
      },
      { returnDocument: "after", runValidators: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      owner: updatedOwner,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

// ==========================================
// CHANGE ACCOUNT PASSWORD
// ==========================================
const changePassword = async (req, res) => {
  try {
    const ownerId = getOwnerId(req);
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    const owner = await Owner.findById(ownerId);

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Owner account not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, owner.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect current password",
      });
    }

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    owner.password = await bcrypt.hash(newPassword, salt);
    await owner.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to change password",
      error: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
};