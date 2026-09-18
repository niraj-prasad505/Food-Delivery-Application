// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Added useLocation

import { createOtp, registerUser } from "../services/authService";
import { useUser } from "../context/UserContext";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to check where user came from
  const { login } = useUser();

  const redirectPath = location.state?.from || "/";

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Send Registration OTP
  const handleSendOtp = async () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await createOtp(email);
      setOtpSent(true);
    } catch (error) {
      setError(error.response?.data?.message || "Unable to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Register & Auto-Sync Guest Cart/Wishlist
  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await registerUser({
        fullname,
        email,
        otp,
        password,
        confirmPassword,
      });

      if (response.data?.user) {
        await login(response.data.user); // Syncs guest cart/wishlist to DB
        navigate(redirectPath, { replace: true }); // Navigates seamlessly back to Checkout
      } else {
        navigate("/login", { state: { from: redirectPath } });
      }
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 flex justify-center items-center px-4 py-10 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Create Your Account
          </h1>
          <p className="text-center text-sm text-gray-500 mt-2 mb-7">
            Join SnackDrop and start ordering delicious food!
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm outline-none focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 min-w-0 px-4 py-3 border border-gray-200 rounded-md text-sm outline-none focus:border-orange-500"
                  required
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="px-4 py-3 bg-orange-500 text-white rounded-md text-sm font-medium hover:bg-orange-600 disabled:opacity-50"
                >
                  {otpSent ? "Resend" : "Send OTP"}
                </button>
              </div>
            </div>

            {otpSent && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification OTP
                </label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm outline-none focus:border-orange-500"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm outline-none focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm outline-none focus:border-orange-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!otpSent || loading}
              className="w-full py-3 mt-2 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {error && (
            <p className="text-center text-sm text-red-500 mt-4">{error}</p>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link 
              to="/login" 
              state={{ from: redirectPath }}
              className="font-medium text-orange-500 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}