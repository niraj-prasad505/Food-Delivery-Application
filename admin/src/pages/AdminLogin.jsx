import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

import {
  adminLogin,
  createAdminLoginOtp,
  adminLoginWithOtp,
} from "../services/adminAuthService";
import { useAdmin } from "../context/AdminContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAdmin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loginType, setLoginType] = useState("password");
  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Admin Password Login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await adminLogin({ email, password });
      login(response.data.owner);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // Send Admin Login OTP
  const handleSendOtp = async () => {
    if (!email) {
      setError("Please enter your registered email address.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await createAdminLoginOtp(email);
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to send verification OTP");
    } finally {
      setLoading(false);
    }
  };

  // Admin OTP Login
  const handleOtpLogin = async (e) => {
    e.preventDefault();

    if (!otp || otp.length < 4) {
      setError("Please enter a valid OTP code.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await adminLoginWithOtp(email, otp);
      login(response.data.owner);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const changeLoginType = (type) => {
    setLoginType(type);
    setError("");
    setOtp("");
    setOtpSent(false);
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-slate-50/60 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-100">
          {/* Brand & Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-600 mb-4 shadow-xs">
              <ShieldCheck size={26} strokeWidth={2.2} />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Merchant Portal
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Sign in to manage your shops, orders, and products.
            </p>
          </div>

          {/* Segmented Tab Switcher */}
          <div className="flex rounded-xl bg-slate-100/80 p-1 mb-6 border border-slate-200/50">
            <button
              type="button"
              onClick={() => changeLoginType("password")}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-150 ${
                loginType === "password"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Password
            </button>

            <button
              type="button"
              onClick={() => changeLoginType("otp")}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-150 ${
                loginType === "otp"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              One-Time Passcode
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-start gap-3 p-3.5 mb-6 rounded-xl bg-rose-50 border border-rose-200/60 text-rose-700 text-xs leading-relaxed animate-in fade-in-50">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Password Login Form */}
          {loginType === "password" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="email"
                    placeholder="name@business.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none transition focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 placeholder:text-slate-400 font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <Link
                    to="/admin/forgot-password"
                    className="text-xs font-semibold text-orange-600 hover:text-orange-700 transition"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none transition focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 placeholder:text-slate-400 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm rounded-xl shadow-xs transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* OTP Login Form */}
          {loginType === "otp" && (
            <form onSubmit={handleOtpLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="email"
                    placeholder="name@business.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={otpSent}
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none transition focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 placeholder:text-slate-400 font-medium disabled:opacity-60"
                  />
                </div>
              </div>

              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm rounded-xl shadow-xs transition active:scale-[0.99] disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Dispatching code...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Passcode</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Enter 6-Digit Code
                    </label>
                    <div className="relative">
                      <KeyRound
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      />
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="000000"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.trim())}
                        required
                        className="w-full pl-10 pr-4 py-2.5 text-center text-base tracking-widest font-mono font-bold bg-slate-50/50 border border-slate-200 rounded-xl outline-none transition focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm rounded-xl shadow-xs transition active:scale-[0.99] disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify & Enter</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center pt-2">
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={loading}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 transition disabled:opacity-50"
                    >
                      <RefreshCw size={13} />
                      Resend Code
                    </button>
                  </div>
                </>
              )}
            </form>
          )}

          {/* Footer Note */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Need to register a new restaurant branch?{" "}
              <Link
                to="/register"
                className="font-semibold text-orange-600 hover:text-orange-700 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}