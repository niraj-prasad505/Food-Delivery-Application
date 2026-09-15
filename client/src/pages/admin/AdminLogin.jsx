import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  adminLogin,
  createAdminLoginOtp,
  adminLoginWithOtp,
} from "../../services/adminAuthService";

// import { useUser } from "../context/UserContext";
import { useAdmin } from "../../context/AdminContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAdmin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

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

      const response = await adminLogin({
        email,
        password,
      });

      login(response.data.owner);

      navigate("/admin");
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // Send Admin Login OTP
  const handleSendOtp = async () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await createAdminLoginOtp(email);

      setOtpSent(true);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // Admin OTP Login
  const handleOtpLogin = async (e) => {
    e.preventDefault();

    if (!otp) {
      setError("Please enter OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await adminLoginWithOtp(
        email,
        otp
      );

      login(response.data.owner);

      navigate("/admin");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // Switch login type
  const changeLoginType = (type) => {
    setLoginType(type);
    setError("");
    setOtp("");
    setOtpSent(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm p-8">

        {/* Heading */}
        <div className="text-center mb-7">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome Back!
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Log in to your admin account
          </p>
        </div>

        {/* Login Type */}
        <div className="flex border-b border-gray-200 mb-6">

          <button
            type="button"
            onClick={() => changeLoginType("password")}
            className={`flex-1 pb-3 text-sm font-medium ${
              loginType === "password"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-500"
            }`}
          >
            Password
          </button>

          <button
            type="button"
            onClick={() => changeLoginType("otp")}
            className={`flex-1 pb-3 text-sm font-medium ${
              loginType === "otp"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-500"
            }`}
          >
            Login with OTP
          </button>

        </div>

        {/* Password Login */}
        {loginType === "password" && (
          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-md
                           outline-none focus:border-orange-500"
                required
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">

                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>

                <Link
                  to="/admin/forgot-password"
                  className="text-xs text-orange-500 hover:underline"
                >
                  Forgot Password?
                </Link>

              </div>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-md
                           outline-none focus:border-orange-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-500 text-white rounded-md
                         font-medium hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>
        )}

        {/* OTP Login */}
        {loginType === "otp" && (
          <form
            onSubmit={handleOtpLogin}
            className="space-y-5"
          >

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-md
                           outline-none focus:border-orange-500"
                required
              />
            </div>

            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full py-3 bg-orange-500 text-white rounded-md
                           font-medium hover:bg-orange-600 disabled:opacity-50"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OTP
                  </label>

                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-md
                               outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-orange-500 text-white rounded-md
                             font-medium hover:bg-orange-600 disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Login"}
                </button>

                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full text-sm text-orange-500 hover:underline"
                >
                  Resend OTP
                </button>
              </>
            )}

          </form>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-sm text-red-500 mt-4">
            {error}
          </p>
        )}

      </div>

    </main>
  );
}
