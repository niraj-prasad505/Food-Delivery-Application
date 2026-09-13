import API from "./api";

// Get logged-in user's profile
export const getProfile = async () => {
    const response = await API.get("/users/profile");
    return response.data;
};

// Update logged-in user's profile
export const updateProfile = async (userData) => {
    const response = await API.patch(
        "/users/profile",
        userData
    );

    return response.data;
};