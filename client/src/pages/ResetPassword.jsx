// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetUserPassword } from "../services/authService"; // Ensure endpoint points to /users/reset-password/:token

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await resetUserPassword(token, password, confirmPassword);
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "This reset link is invalid or has expired. Please request a new one."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-center items-center px-4 py-12">
      {/* Brand Header */}
      <div className="mb-8 text-center">
        <Link to="/" className="inline-flex items-center gap-1">
          <span className="text-3xl font-extrabold text-[#FF5A36] tracking-tight">
            Snack<span className="text-[#FF7A59]">Drop</span>
          </span>
        </Link>
      </div>

      {/* Card Container */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-8 sm:p-10">
        {!isSuccess ? (
          <>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Create New Password
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                Your new password must be at least 8 characters long.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    required
                    className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:border-[#FF5A36] focus:ring-2 focus:ring-[#FF5A36]/20 outline-none transition-all text-sm text-gray-800 placeholder-gray-400 bg-gray-50/50 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  required
                  className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:border-[#FF5A36] focus:ring-2 focus:ring-[#FF5A36]/20 outline-none transition-all text-sm text-gray-800 placeholder-gray-400 bg-gray-50/50 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-4 bg-[#FF5A36] hover:bg-[#E44B27] active:scale-[0.99] text-white font-semibold rounded-full shadow-lg shadow-[#FF5A36]/25 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </>
        ) : (
          /* Success Screen */
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Password Changed!
            </h2>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Your password has been reset successfully. Redirecting you to login...
            </p>
            <Link
              to="/login"
              className="inline-block w-full py-3.5 px-4 bg-[#FF5A36] hover:bg-[#E44B27] text-white font-semibold rounded-full shadow-md transition duration-200"
            >
              Go to Login Now
            </Link>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#FF5A36] transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;