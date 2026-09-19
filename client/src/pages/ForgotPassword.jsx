import React, { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../services/authService"; // Adjust import path to your api file

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    try {
      setLoading(true);
      await requestPasswordReset(email.trim());
      setIsSubmitted(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send reset link. Please try again."
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

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-8 sm:p-10">
        {!isSubmitted ? (
          <>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Forgot Password?
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:border-[#FF5A36] focus:ring-2 focus:ring-[#FF5A36]/20 outline-none transition-all text-sm text-gray-800 placeholder-gray-400 bg-gray-50/50 focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-[#FF5A36] hover:bg-[#E44B27] active:scale-[0.99] text-white font-semibold rounded-full shadow-lg shadow-[#FF5A36]/25 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          </>
        ) : (
          /* Confirmation State */
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-[#FFF2EE] text-[#FF5A36] rounded-full flex items-center justify-center mx-auto mb-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Inbox</h2>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              We have sent password reset instructions to{" "}
              <span className="font-semibold text-gray-800">{email}</span>. Please
              check your email and click the link within 1 hour.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-xs font-semibold text-gray-500 hover:text-[#FF5A36] transition-colors"
            >
              Didn't receive an email? Click here to try again
            </button>
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

export default ForgotPassword;