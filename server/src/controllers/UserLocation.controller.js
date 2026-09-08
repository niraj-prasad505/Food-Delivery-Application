const UserLocation = require("../models/UserLocation.model");

const saveUserLocation = async (req, res) => {
    try {
        const { latitude, longitude, address } = req.body;
        const userId = req.user.id;

        if (latitude === undefined || longitude === undefined) {
            return res.status(400).json({
                message: "Latitude and longitude are required"
            });
        }

        const location = await UserLocation.findOneAndUpdate(
            { userId },
            {
                latitude,
                longitude,
                address: address || null
            },
            {
                new: true,
                upsert: true
            }
        );

        res.status(200).json({
            message: "Location saved successfully",
            location
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { saveUserLocation };