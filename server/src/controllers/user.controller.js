const User = require("../models/User-model");

// GET USER PROFILE
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select(
            "-password -resetPasswordToken -resetPasswordExpires"
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("GET PROFILE ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get profile",
            error: error.message,
        });
    }
};


// UPDATE USER PROFILE
const updateProfile = async (req, res) => {
    try {
        const {
            fullname,
            email,
            contact,
            picture,
            gender,
            dob,
        } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Update only provided fields
        if (fullname !== undefined) {
            user.fullname = fullname;
        }

        if (email !== undefined) {
            user.email = email;
        }

        if (contact !== undefined) {
            user.contact = contact;
        }

        if (picture !== undefined) {
            user.picture = picture;
        }

        if (gender !== undefined) {
            user.gender = gender === "" ? undefined : gender;
        }

        if (dob !== undefined) {
            user.dob = dob;
        }

        await user.save();

        const updatedUser = await User.findById(
            req.user.id
        ).select(
            "-password -resetPasswordToken -resetPasswordExpires"
        );

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("UPDATE PROFILE ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update profile",
            error: error.message,
        });
    }
};

module.exports = {
    getProfile,
    updateProfile,
};