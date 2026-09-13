import React, { useEffect, useState } from "react";

import {
    getProfile,
    updateProfile,
} from "../services/userService";

import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import ProfileForm from "../components/profile/ProfileForm";

export default function Profile() {
    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        contact: "",
        gender: "",
        dob: "",
    });

    // Load profile
    const loadProfile = async () => {
        try {
            const data = await getProfile();

            const profile = data.user;

            setUser(profile);

            setFormData({
                fullname: profile?.fullname || "",
                email: profile?.email || "",
                contact: profile?.contact || "",
                gender: profile?.gender || "",
                dob: profile?.dob
                    ? profile.dob.split("T")[0]
                    : "",
            });
        } catch (error) {
            console.error(
                "Error loading profile:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    // Handle input
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Save profile
    const handleSave = async () => {
        try {
            setSaving(true);

            const data = await updateProfile(formData);

            const updatedUser = data.user;

            setUser(updatedUser);

            setFormData({
                fullname: updatedUser?.fullname || "",
                email: updatedUser?.email || "",
                contact: updatedUser?.contact || "",
                gender: updatedUser?.gender || "",
                dob: updatedUser?.dob
                    ? updatedUser.dob.split("T")[0]
                    : "",
            });

            setEditing(false);
        } catch (error) {
            console.error(
                "UPDATE PROFILE ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to update profile"
            );
        } finally {
            setSaving(false);
        }
    };

    // Cancel edit
    const handleCancel = () => {
        setFormData({
            fullname: user?.fullname || "",
            email: user?.email || "",
            contact: user?.contact || "",
            gender: user?.gender || "",
            dob: user?.dob
                ? user.dob.split("T")[0]
                : "",
        });

        setEditing(false);
    };

    // Loading
    if (loading) {
        return (
            <div className="min-h-screen bg-[#fffaf8] flex items-center justify-center">
                <div className="text-center">

                    <div
                        className="
                            w-10
                            h-10
                            border-4
                            border-[#ffe1d9]
                            border-t-[#ff6547]
                            rounded-full
                            animate-spin
                            mx-auto
                        "
                    />

                    <p className="text-gray-500 text-sm mt-4">
                        Loading your profile...
                    </p>

                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fffaf8] px-5 md:px-10 lg:px-16 py-10">

            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <ProfileHeader user={user} />

                {/* Main Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-7">

                    {/* Sidebar */}
                    <ProfileSidebar user={user} />

                    {/* Form */}
                    <ProfileForm
                        formData={formData}
                        editing={editing}
                        saving={saving}
                        handleChange={handleChange}
                        handleSave={handleSave}
                        handleCancel={handleCancel}
                        setEditing={setEditing}
                    />

                </div>

            </div>

        </div>
    );
}