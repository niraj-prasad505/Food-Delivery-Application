import React, { useState, useEffect } from "react";
import {
  User,
  Shield,
  Bell,
  Lock,
  Mail,
  Phone,
  Store,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Save,
  Volume2,
  Zap,
  LogOut,
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import {
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
} from "../services/adminProfileService";

const TABS = [
  { id: "profile", label: "Merchant Profile", icon: User },
  { id: "preferences", label: "Store Preferences", icon: Bell },
  { id: "security", label: "Security & Login", icon: Shield },
];

export default function Settings() {
  const { admin, login, logout } = useAdmin();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Operational Preferences State
  const [preferences, setPreferences] = useState({
    orderSoundAlert: true,
    autoAcceptOrders: false,
    emailReceipts: true,
    smsDispatches: true,
  });

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: "", message: "" }), 3500);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await getAdminProfile();
        if (res.success && res.owner) {
          setProfileData({
            name: res.owner.name || "",
            email: res.owner.email || "",
            phone: res.owner.phone || "",
          });
        }
      } catch {
        if (admin) {
          setProfileData({
            name: admin.name || "",
            email: admin.email || "",
            phone: admin.phone || "",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [admin]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaveLoading(true);
      const res = await updateAdminProfile({
        name: profileData.name,
        phone: profileData.phone,
      });

      if (res.success && res.owner) {
        login(res.owner);
        showFeedback("success", "Profile details updated successfully");
      }
    } catch (err) {
      showFeedback("error", err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showFeedback("error", "New passwords do not match");
      return;
    }

    try {
      setSaveLoading(true);
      const res = await changeAdminPassword(passwordData);
      if (res.success) {
        showFeedback("success", "Password updated successfully");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      showFeedback("error", err.response?.data?.message || "Password update failed");
    } finally {
      setSaveLoading(false);
    }
  };

  const avatarLetter = (profileData.name || "A").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8 font-sans text-slate-900 space-y-6">
      {/* Toast Alert */}
      {feedback.message && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-xs font-semibold shadow-lg backdrop-blur-md animate-in fade-in-0 ${
            feedback.type === "success"
              ? "bg-emerald-50/90 border-emerald-200 text-emerald-800"
              : "bg-rose-50/90 border-rose-200 text-rose-800"
          }`}
        >
          {feedback.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Account & Store Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your personal credentials, operational automation, and security controls.
        </p>
      </div>

      {/* Profile Summary Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-orange-600 font-extrabold text-white text-3xl shadow-md shadow-orange-500/20">
            {avatarLetter}
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-slate-900">
                {profileData.name || "Merchant Owner"}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200">
                Authorized Owner
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{profileData.email}</p>
            <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Store size={14} className="text-orange-600" />
                SnackDrop Merchant Portal
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition active:scale-95 shrink-0"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>

      {/* Main Settings Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Tabs */}
        <div className="space-y-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon size={16} className={isActive ? "text-orange-400" : "text-slate-400"} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Tab Body */}
        <div className="lg:col-span-3 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
          {/* TAB 1: PROFILE */}
          {activeTab === "profile" && (
            <form onSubmit={handleSaveProfile} className="space-y-5 max-w-xl">
              <div>
                <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your contact details across all registered outlets.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    required
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="email"
                    disabled
                    value={profileData.email}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-100/70 border border-slate-200 rounded-xl outline-none font-medium text-slate-500 cursor-not-allowed"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Official account email is tied to authentication and cannot be edited.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Contact Phone Number
                </label>
                <div className="relative">
                  <Phone
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 font-medium"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-orange-500 transition active:scale-95 disabled:opacity-50"
                >
                  {saveLoading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: PREFERENCES */}
          {activeTab === "preferences" && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h3 className="text-base font-bold text-slate-900">Automation & Alerts</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure store notifications and dispatch automation.
                </p>
              </div>

              <div className="space-y-4 divide-y divide-slate-100">
                <div className="flex items-center justify-between pt-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-orange-50 text-orange-600 shrink-0">
                      <Volume2 size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">
                        Order Notification Chime
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Play an alert sound when a new customer order is received.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setPreferences((prev) => ({
                        ...prev,
                        orderSoundAlert: !prev.orderSoundAlert,
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out cursor-pointer ${
                      preferences.orderSoundAlert ? "bg-orange-600" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                        preferences.orderSoundAlert ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                      <Zap size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">
                        Auto-Accept Incoming Orders
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Automatically transition pending requests to confirmed.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setPreferences((prev) => ({
                        ...prev,
                        autoAcceptOrders: !prev.autoAcceptOrders,
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out cursor-pointer ${
                      preferences.autoAcceptOrders ? "bg-emerald-600" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                        preferences.autoAcceptOrders ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                      <Mail size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">
                        Daily Financial Summary
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Receive end-of-day sales settlements in your inbox.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setPreferences((prev) => ({
                        ...prev,
                        emailReceipts: !prev.emailReceipts,
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out cursor-pointer ${
                      preferences.emailReceipts ? "bg-blue-600" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                        preferences.emailReceipts ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => showFeedback("success", "Preferences saved")}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition"
                >
                  <Save size={15} />
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: SECURITY */}
          {activeTab === "security" && (
            <form onSubmit={handleSavePassword} className="space-y-5 max-w-xl">
              <div>
                <h3 className="text-base font-bold text-slate-900">Account Credentials</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update the password used to access this merchant portal.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Current Password *
                </label>
                <div className="relative">
                  <Lock
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type={showCurrent ? "text" : "password"}
                    required
                    placeholder="••••••••••••"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  New Password *
                </label>
                <div className="relative">
                  <Lock
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type={showNew ? "text" : "password"}
                    required
                    minLength={6}
                    placeholder="Minimum 6 characters"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <Lock
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type={showConfirm ? "text" : "password"}
                    required
                    minLength={6}
                    placeholder="Re-type new password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-orange-500 transition active:scale-95 disabled:opacity-50"
                >
                  {saveLoading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  Update Password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}