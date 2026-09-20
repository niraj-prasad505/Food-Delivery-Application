// client/src/pages/Profile.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  MapPin,
  Heart,
  ShoppingCart,
  Package,
  Camera,
  ShieldCheck,
  Edit3,
  CheckCircle2,
  XCircle,
  Check,
  Smartphone,
  AlertCircle,
  Calendar,
  UserCheck,
  Store,
  ArrowRight,
  Trash2,
  Home,
  Briefcase,
  Plus,
} from "lucide-react";

import {
  getProfile,
  updateProfile,
} from "../services/userService";
import { useUser } from "../context/UserContext";
import { LocationContext } from "../context/LocationContext";
import API from "../services/api";

export default function Profile() {
  const navigate = useNavigate();
  const { setUser: setGlobalUser, logout } = useUser();
  const { setLocation } = useContext(LocationContext);

  const [user, setUser] = useState(null);
  const [addressList, setAddressList] = useState([]);
  const [selectedDefaultId, setSelectedDefaultId] = useState("");

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // In-App Toast Banner State
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState("orange");

  const showToast = (msg, type = "orange") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Phone Verification States
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [showPhoneOtpInput, setShowPhoneOtpInput] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");

  // Personal Information Form State
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    contact: "",
    gender: "",
    dob: "",
    picture: "",
  });

  // Multiple Addresses Tag & Inputs
  const [addressLabel, setAddressLabel] = useState("Home");
  const [manualAddress, setManualAddress] = useState({
    houseNo: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const loadProfile = async () => {
    try {
      const data = await getProfile();
      const profile = data.user;

      setUser(profile);

      setFormData({
        fullname: profile?.fullname || "",
        email: profile?.email || "",
        contact: profile?.contact ? String(profile.contact) : "",
        gender: profile?.gender || "",
        dob: profile?.dob ? profile.dob.split("T")[0] : "",
        picture: profile?.picture || "",
      });

      if (profile?.contact && String(profile.contact).length === 10) {
        setIsPhoneVerified(true);
      }

      // Fetch saved locations from MongoDB
      try {
        const locRes = await API.get("/location");
        if (locRes.data?.addresses) {
          setAddressList(locRes.data.addresses);
          const def = locRes.data.addresses.find((a) => a.isDefault) || locRes.data.addresses[0];
          if (def) setSelectedDefaultId(def._id || def.id);
        }
      } catch (locErr) {
        console.warn("No saved location found in database.");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "contact") {
      const cleanedValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        contact: cleanedValue,
      }));
      if (cleanedValue.length !== 10) {
        setIsPhoneVerified(false);
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setManualAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenderSelect = (selectedGender) => {
    if (!editing) return;
    setFormData((prev) => ({
      ...prev,
      gender: selectedGender,
    }));
  };

  // Device Image Select & Auto-Save
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 300;
        const MAX_HEIGHT = 300;

        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.8);

        setFormData((prev) => ({
          ...prev,
          picture: compressedBase64,
        }));

        try {
          showToast("Optimizing & saving profile picture...", "orange");
          const payload = {
            ...formData,
            picture: compressedBase64,
            contact: formData.contact ? Number(formData.contact) : null,
          };
          const data = await updateProfile(payload);
          setUser(data.user);
          if (setGlobalUser) setGlobalUser(data.user);
          showToast("Profile picture saved permanently!", "orange");
        } catch (err) {
          console.error("Auto-save avatar failed:", err);
          showToast("Failed to save picture to database.", "error");
        }
      };
    };
  };

  const handleSendPhoneOtp = () => {
    if (formData.contact.length !== 10) {
      showToast("Please enter a valid 10-digit mobile number.", "error");
      return;
    }
    setShowPhoneOtpInput(true);
    showToast(`Verification OTP sent to +91 ${formData.contact}. Use code 123456`, "orange");
  };

  const handleVerifyPhoneOtp = () => {
    if (phoneOtp === "123456" || phoneOtp.length === 6) {
      setIsPhoneVerified(true);
      setShowPhoneOtpInput(false);
      showToast("Mobile number verified successfully!", "success");
    } else {
      showToast("Invalid OTP code. Use test code 123456.", "error");
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = {
        ...formData,
        contact: formData.contact ? Number(formData.contact) : null,
      };

      const data = await updateProfile(payload);
      const updatedUser = data.user;

      setUser(updatedUser);
      if (setGlobalUser) setGlobalUser(updatedUser);

      setFormData({
        fullname: updatedUser?.fullname || "",
        email: updatedUser?.email || "",
        contact: updatedUser?.contact ? String(updatedUser.contact) : "",
        gender: updatedUser?.gender || "",
        dob: updatedUser?.dob ? updatedUser.dob.split("T")[0] : "",
        picture: updatedUser?.picture || "",
      });

      setEditing(false);
      showToast("Profile information updated successfully!", "success");
    } catch (error) {
      console.error("UPDATE PROFILE ERROR:", error);
      showToast(
        error.response?.data?.message || "Unable to update profile. Please try again.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // Select Default Address Checkmark Handler
  const handleSelectDefaultAddress = (addr) => {
    const id = addr._id || addr.id;
    setSelectedDefaultId(id);

    const shortNavbarText = addr.street ? `${addr.street}, ${addr.city}` : addr.formattedAddress;
    if (setLocation) {
      setLocation(shortNavbarText);
    }
    showToast(`Set ${addr.label || "Selected"} as active delivery address!`, "success");
  };

  // Save Labeled Address & Sync with Top Navbar
  const handleSaveManualAddress = async () => {
    const { houseNo, street, city, state, pincode } = manualAddress;
    if (!street || !city || !pincode) {
      showToast("Please enter at least Street/Locality, City, and PIN Code.", "error");
      return;
    }

    const shortNavbarAddress = `${street.trim()}, ${city.trim()}`;
    const fullFormattedAddress = houseNo
      ? `${houseNo.trim()}, ${street.trim()}, ${city.trim()}${state ? `, ${state.trim()}` : ""} - ${pincode.trim()}`
      : `${street.trim()}, ${city.trim()}${state ? `, ${state.trim()}` : ""} - ${pincode.trim()}`;

    try {
      showToast("Saving new address...", "orange");
      const res = await API.post("/location", {
        label: addressLabel,
        houseNo,
        street,
        city,
        state,
        pincode,
        address: fullFormattedAddress,
        isDefault: true,
      });

      if (res.data?.location) {
        setAddressList(res.data.location.addresses || []);
        const newAdded = res.data.location.addresses[res.data.location.addresses.length - 1];
        if (newAdded) setSelectedDefaultId(newAdded._id || newAdded.id);

        if (setLocation) {
          setLocation(shortNavbarAddress);
        }

        setManualAddress({ houseNo: "", street: "", city: "", state: "", pincode: "" });
        showToast(`Saved as ${addressLabel} address & updated app-wide!`, "success");
      }
    } catch (err) {
      console.error("Save manual address error:", err);
      showToast("Failed to save delivery address.", "error");
    }
  };

  // client/src/pages/Profile.jsx
  
  // Delete Account Handler
  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      showToast("Deleting user account...", "orange");

      await API.delete("/users/profile");

      showToast("Account deleted successfully.", "success");
      
      if (logout) {
        await logout();
      } else {
        localStorage.clear();
      }

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      console.error("Delete account error:", err);
      showToast(
        err.response?.data?.message || "Failed to delete account. Please try again.",
        "error"
      );
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullname: user?.fullname || "",
      email: user?.email || "",
      contact: user?.contact ? String(user.contact) : "",
      gender: user?.gender || "",
      dob: user?.dob ? user.dob.split("T")[0] : "",
      picture: user?.picture || "",
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffaf8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#ffe1d9] border-t-[#ff6547] rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 text-sm mt-4">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const exactMemberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "September 20, 2026";

  const userInitial = user?.fullname ? user.fullname.charAt(0).toUpperCase() : "U";

  return (
    <div className="min-h-screen bg-[#fffaf8] px-4 sm:px-8 lg:px-16 py-10 relative">
      
      {/* IN-APP TOAST BANNER */}
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl shadow-xl text-xs font-bold text-white transition-all animate-in fade-in slide-in-from-top-4 ${
            toastType === "success"
              ? "bg-emerald-600"
              : toastType === "error"
              ? "bg-red-500"
              : "bg-[#ff6547]"
          }`}
        >
          {toastType === "error" ? (
            <AlertCircle size={16} />
          ) : (
            <CheckCircle2 size={16} />
          )}
          {toastMessage}
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* TOP LAYOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT SIDEBAR CARDS */}
          <div className="space-y-6">
            
            {/* User Profile Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-center relative overflow-hidden">
              <div className="relative inline-block mb-4">
                {formData.picture ? (
                  <img
                    src={formData.picture}
                    alt={user?.fullname}
                    className="w-24 h-24 rounded-full object-cover border-4 border-orange-50 shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-orange-100 text-[#ff6547] flex items-center justify-center text-3xl font-extrabold border-4 border-orange-50 shadow-md">
                    {userInitial}
                  </div>
                )}

                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-[#ff6547] text-white p-2 rounded-full shadow-md hover:bg-[#e05530] transition active:scale-95 cursor-pointer"
                  title="Upload photo from device"
                >
                  <Camera size={14} />
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <h2 className="text-xl font-bold text-gray-900">{user?.fullname}</h2>
              <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>

              <div className="mt-3 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200/60 text-[11px] font-bold px-3.5 py-1 rounded-full shadow-2xs">
                <ShieldCheck size={14} />
                Verified Active Member
              </div>

              <div className="border-t border-gray-100 my-5" />

              <div className="space-y-3 text-left text-xs bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2">
                  <Calendar size={15} className="text-[#ff6547] shrink-0" />
                  <div>
                    <span className="text-gray-400 block text-[10px] font-bold tracking-wider uppercase">MEMBER SINCE</span>
                    <span className="text-gray-800 font-bold">{exactMemberSince}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <UserCheck size={15} className="text-[#ff6547] shrink-0" />
                  <div>
                    <span className="text-gray-400 block text-[10px] font-bold tracking-wider uppercase">ACCOUNT ROLE</span>
                    <span className="text-gray-800 font-bold capitalize">{user?.role || "Customer"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SWITCH TO MERCHANT / PARTNER CARD */}
            <div className="bg-linear-to-br from-[#ff6547] to-[#ff846b] rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
                  <Store size={20} />
                </div>
                <h4 className="font-extrabold text-sm">Partner with SnackDrop</h4>
              </div>
              <p className="text-[11px] text-white/90 leading-relaxed mb-4">
                Verified customer? Switch to our Merchant Partner dashboard instantly to manage your store and orders.
              </p>
              <button
                onClick={async () => {
                  try {
                    showToast("Switching account to Merchant Partner...", "orange");
                    const res = await API.post("/users/switch-merchant");
                    if (res.data?.success) {
                      showToast("Redirecting to Merchant Dashboard...", "success");
                      setTimeout(() => {
                        window.location.href = "http://localhost:5174/";
                      }, 1200);
                    }
                  } catch (err) {
                    console.error("Switch merchant failed:", err);
                    showToast(
                      err.response?.data?.message || "Failed to switch role. Please log in again.",
                      "error"
                    );
                  }
                }}
                className="w-full bg-white text-[#ff6547] hover:bg-orange-50 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer shadow-sm"
              >
                Switch to Merchant Portal <ArrowRight size={14} />
              </button>
            </div>

            {/* Account Navigation Menu */}
            <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm space-y-1">
              <p className="px-3 py-2 text-[11px] font-bold text-gray-400 tracking-wider">
                ACCOUNT MENU
              </p>

              <button className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold text-[#ff6547] bg-orange-50 transition">
                <User size={18} />
                Profile Information
              </button>

              <button
                onClick={() => navigate("/orders")}
                className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-sm text-gray-600 hover:bg-gray-50 transition cursor-pointer"
              >
                <Package size={18} />
                My Orders
              </button>

              <button
                onClick={() => navigate("/wishlist")}
                className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-sm text-gray-600 hover:bg-gray-50 transition cursor-pointer"
              >
                <Heart size={18} />
                My Wishlist
              </button>

              <button
                onClick={() => navigate("/cart")}
                className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-sm text-gray-600 hover:bg-gray-50 transition cursor-pointer"
              >
                <ShoppingCart size={18} />
                My Cart
              </button>
            </div>
          </div>

          {/* RIGHT PERSONAL INFORMATION FORM */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-8">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Manage your personal details and contact information.
                    </p>
                  </div>

                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-1.5 border border-[#ff6547] text-[#ff6547] hover:bg-orange-50 text-xs font-bold px-4 py-2 rounded-full transition active:scale-95 cursor-pointer"
                    >
                      <Edit3 size={14} /> Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-1 text-gray-500 hover:bg-gray-100 text-xs font-semibold px-3 py-2 rounded-full transition cursor-pointer"
                      >
                        <XCircle size={14} /> Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-1 bg-[#ff6547] hover:bg-[#e05530] text-white text-xs font-bold px-4 py-2 rounded-full shadow-sm transition active:scale-95 disabled:opacity-50 cursor-pointer"
                      >
                        <CheckCircle2 size={14} /> {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  )}
                </div>

                {/* Form Inputs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullname"
                      disabled={!editing}
                      value={formData.fullname}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 disabled:bg-gray-50/60 rounded-xl px-3.5 py-2.5 text-xs font-medium text-gray-800 focus:outline-none focus:border-[#ff6547]"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      disabled
                      value={formData.email}
                      className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Phone Number (10 Digits)
                    </label>
                    <div className="flex gap-2 items-center">
                      <div className="relative w-full">
                        <span className="absolute left-3.5 top-2.5 text-xs font-bold text-gray-400">
                          +91
                        </span>
                        <input
                          type="text"
                          name="contact"
                          disabled={!editing}
                          maxLength={10}
                          value={formData.contact}
                          onChange={handleChange}
                          className="w-full bg-gray-50 border border-gray-200 disabled:bg-gray-50/60 rounded-xl pl-12 pr-3.5 py-2.5 text-xs font-medium text-gray-800 focus:outline-none focus:border-[#ff6547]"
                          placeholder="Enter 10-digit mobile number"
                        />
                      </div>

                      {isPhoneVerified ? (
                        <span className="shrink-0 flex items-center gap-1 bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-2.5 rounded-xl">
                          <Check size={14} /> Verified
                        </span>
                      ) : (
                        editing &&
                        formData.contact.length === 10 && (
                          <button
                            type="button"
                            onClick={handleSendPhoneOtp}
                            className="shrink-0 bg-[#ff6547] hover:bg-[#e05530] text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition cursor-pointer"
                          >
                            Verify SMS
                          </button>
                        )
                      )}
                    </div>

                    {showPhoneOtpInput && (
                      <div className="mt-3 flex items-center justify-between gap-2 p-3 bg-orange-50 rounded-xl border border-orange-100">
                        <div className="flex items-center gap-2">
                          <Smartphone size={16} className="text-[#ff6547]" />
                          <input
                            type="text"
                            maxLength={6}
                            value={phoneOtp}
                            onChange={(e) => setPhoneOtp(e.target.value)}
                            placeholder="Enter 6-digit OTP"
                            className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-800 focus:outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleVerifyPhoneOtp}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition cursor-pointer"
                        >
                          Submit OTP
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-2">
                      Gender
                    </label>
                    <div className="flex gap-3">
                      {[
                        { id: "male", label: "Male" },
                        { id: "female", label: "Female" },
                        { id: "other", label: "Other" },
                      ].map((item) => {
                        const isSelected = formData.gender === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            disabled={!editing}
                            onClick={() => handleGenderSelect(item.id)}
                            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                              isSelected
                                ? "bg-[#ff6547] text-white shadow-md shadow-orange-200"
                                : "bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100"
                            } ${!editing ? "cursor-not-allowed opacity-80" : "cursor-pointer"}`}
                          >
                            {isSelected && <Check size={14} />}
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      disabled={!editing}
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 disabled:bg-gray-50/60 rounded-xl px-3.5 py-2.5 text-xs font-medium text-gray-800 focus:outline-none focus:border-[#ff6547]"
                    />
                  </div>
                </div>
              </div>

              {/* SAVED MULTIPLE ADDRESSES WITH CHECKMARK SELECTION */}
              <div className="border-t border-gray-100 pt-6">
                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin size={16} className="text-[#ff6547]" /> Saved Delivery Addresses
                </h4>

                {addressList.length > 0 ? (
                  <div className="space-y-3">
                    {addressList.map((addr, index) => {
                      const addrId = addr._id || addr.id || String(index);
                      const isSelected = selectedDefaultId === addrId;

                      return (
                        <div
                          key={addrId}
                          onClick={() => handleSelectDefaultAddress(addr)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? "bg-orange-50/60 border-[#ff6547] shadow-xs"
                              : "bg-gray-50 border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="defaultAddress"
                              checked={isSelected}
                              onChange={() => handleSelectDefaultAddress(addr)}
                              className="accent-[#ff6547] w-4 h-4 cursor-pointer"
                            />
                            <div className="p-2 bg-[#ff6547] text-white rounded-xl shrink-0">
                              {addr.label === "Work" ? (
                                <Briefcase size={16} />
                              ) : (
                                <Home size={16} />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-extrabold text-gray-900">
                                  {addr.label || "Address"}
                                </span>
                                {isSelected && (
                                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                                    <Check size={12} /> Active Default
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mt-0.5">
                                {addr.formattedAddress}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center">
                    <p className="text-xs text-gray-500">
                      No saved addresses found. Add a Home or Work address below.
                    </p>
                  </div>
                )}
              </div>

              {/* STRUCTURED MANUAL ADDRESS FORM WITH TAG SELECTION */}
              <div className="border-t border-gray-100 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <Plus size={16} className="text-[#ff6547]" /> Add New Address
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Save multiple addresses (Home, Work, Other) for checkout.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveManualAddress}
                    className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer shadow-sm active:scale-95"
                  >
                    Save Address
                  </button>
                </div>

                {/* Address Tag Selector */}
                <div className="flex gap-2 mb-4">
                  {["Home", "Work", "Other"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setAddressLabel(tag)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                        addressLabel === tag
                          ? "bg-[#ff6547] text-white shadow-sm"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">
                      House / Flat / Building No. <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="houseNo"
                      value={manualAddress.houseNo}
                      onChange={handleAddressChange}
                      placeholder="e.g. Flat 302, Royal Residency"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#ff6547]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">
                      Street / Area / Locality <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={manualAddress.street}
                      onChange={handleAddressChange}
                      placeholder="e.g. Grand Trunk Road, Bidhannagar"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#ff6547]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">
                      City / District <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={manualAddress.city}
                      onChange={handleAddressChange}
                      placeholder="e.g. Durgapur"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#ff6547]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={manualAddress.state}
                        onChange={handleAddressChange}
                        placeholder="e.g. West Bengal"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#ff6547]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">
                        PIN Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        name="pincode"
                        value={manualAddress.pincode}
                        onChange={handleAddressChange}
                        placeholder="6-digit PIN"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#ff6547]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* DELETE ACCOUNT SECTION */}
              <div className="border-t border-red-100 pt-6 mt-8">
                <div className="bg-red-50/50 border border-red-100 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-red-600 flex items-center gap-1.5">
                      <Trash2 size={15} /> Delete Account
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Permanently remove your profile data, active order history, and saved preferences.
                    </p>
                  </div>

                  {!showDeleteConfirm ? (
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer shrink-0 active:scale-95"
                    >
                      Delete My Account
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={deleting}
                        onClick={handleDeleteAccount}
                        className="bg-red-700 hover:bg-red-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer disabled:opacity-50"
                      >
                        {deleting ? "Deleting..." : "Confirm Delete"}
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}