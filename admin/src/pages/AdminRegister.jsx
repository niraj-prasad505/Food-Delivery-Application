import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  Store,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

import {
  createAdminRegistrationOtp,
  adminRegister,
} from "../services/adminAuthService";

export default function AdminRegister() {
  const navigate = useNavigate();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Send Admin Registration OTP
  const handleSendOtp = async () => {
    if (!email) {
      setError("Please enter a valid email address first.");
      return;
    }

    try {
      setSendingOtp(true);
      setError("");

      await createAdminRegistrationOtp(email);
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to send verification OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  // Register Admin
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!otpSent) {
      setError("Please request and verify the OTP code sent to your email.");
      return;
    }

    if (!otp || otp.trim().length < 4) {
      setError("Please provide a valid 6-digit OTP code.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await adminRegister({
        name: fullname,
        email,
        otp,
        password,
        confirmPassword,
      });

      navigate("/admin/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50/60 font-sans text-slate-900">
      {/* Registration Card Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-100">
            {/* Branding Header */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-600 mb-4 shadow-xs">
                <Store size={24} strokeWidth={2.2} />
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Register Store Partner
              </h1>
              <p className="text-sm text-slate-500 mt-1 max-w-xs">
                Join SnackDrop to manage menus, track orders, and grow your outlet.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-3.5 mb-6 rounded-xl bg-rose-50 border border-rose-200/60 text-rose-700 text-xs leading-relaxed animate-in fade-in-50">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none transition focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 placeholder:text-slate-400 font-medium"
                  />
                </div>
              </div>

              {/* Email with OTP Action Button */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Official Email
                  </label>
                  {otpSent && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                      <CheckCircle2 size={13} /> Code Sent
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1 min-w-0">
                    <Mail
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type="email"
                      placeholder="merchant@snackdrop.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none transition focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 placeholder:text-slate-400 font-medium"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingOtp || !email}
                    className="shrink-0 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
                  >
                    {sendingOtp ? (
                      <Loader2 size={14} className="animate-spin text-slate-600" />
                    ) : otpSent ? (
                      <>
                        <RefreshCw size={13} />
                        Resend
                      </>
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                </div>
              </div>

              {/* OTP Input Section (Highlighted when OTP is sent) */}
              {otpSent && (
                <div className="p-3.5 rounded-2xl border border-orange-200/80 bg-orange-50/30 animate-in fade-in-50 duration-150">
                  <label className="block text-xs font-semibold text-orange-950 uppercase tracking-wider mb-2">
                    Verification Code
                  </label>
                  <div className="relative">
                    <KeyRound
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-500 pointer-events-none"
                    />
                    <input
                      type="text"
                      maxLength={6}
                      inputMode="numeric"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.trim())}
                      required
                      className="w-full pl-10 pr-4 py-2.5 text-sm font-mono tracking-wider font-bold bg-white border border-orange-200 rounded-xl outline-none focus:ring-4 focus:ring-orange-500/15 focus:border-orange-500 text-slate-900"
                    />
                  </div>
                </div>
              )}

              {/* Password Fields in 2 Columns for Desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-9 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none transition focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 placeholder:text-slate-400 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Confirm
                  </label>
                  <div className="relative">
                    <Lock
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-9 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none transition focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 placeholder:text-slate-400 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!otpSent || loading}
                className="w-full mt-3 inline-flex items-center justify-center gap-2 py-3 px-4 bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm rounded-xl shadow-xs transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Creating Partner Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Existing Account Footer */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                Already an authorized merchant?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-orange-600 hover:text-orange-700 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Clean Merchant Portal Footer */}
      <footer className="border-t border-slate-200/80 bg-white/70 py-6 px-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-orange-600 tracking-tight">SnackDrop</span>
            <span>• Merchant Operations</span>
          </div>
          <p>© 2026 SnackDrop Technologies. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}