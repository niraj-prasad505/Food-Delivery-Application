const Owner = require("../models/Owner-model");
const OwnerEmailOtp = require("../models/OwnerEmailOtp-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");


// Register
const register = async (req, res) => {
  try {
    const {
      name,
      email,
      otp,
      password,
      confirmPassword
    } = req.body;

    if (
      !name ||
      !email ||
      !otp ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if owner already exists
    const existingOwner = await Owner.findOne({
      email: normalizedEmail
    });

    if (existingOwner) {
      return res.status(400).json({
        message: "Owner already exists"
      });
    }

    // Find registration OTP
    const otpRecord = await OwnerEmailOtp.findOne({
      email: normalizedEmail,
      purpose: "register"
    });

    if (!otpRecord) {
      return res.status(400).json({
        message: "OTP expired or not found"
      });
    }

    // Check OTP attempts
    if (otpRecord.attempts >= 4) {
      await OwnerEmailOtp.deleteOne({
        _id: otpRecord._id
      });

      return res.status(429).json({
        message: "Too many attempts. Please request a new OTP"
      });
    }

    // Verify OTP
    const isOtpValid = await bcrypt.compare(
      otp,
      otpRecord.otp
    );

    if (!isOtpValid) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create owner
    const newOwner = await Owner.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      isVerified: true,
      isActive: true
    });

    // Delete used OTP
    await OwnerEmailOtp.deleteOne({
      _id: otpRecord._id
    });

    return res.status(201).json({
      message: "Owner created successfully",
      owner: {
        _id: newOwner._id,
        name: newOwner.name,
        email: newOwner.email,
        phone: newOwner.phone,
        isVerified: newOwner.isVerified,
        isActive: newOwner.isActive
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

// Create OTP for registration
const createOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if owner already exists
    const existingOwner = await Owner.findOne({
      email: normalizedEmail
    });

    if (existingOwner) {
      return res.status(400).json({
        message: "Owner already exists"
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Hash OTP
    const hashedOtp = await bcrypt.hash(
      otp,
      10
    );

    // Remove previous owner registration OTP
    await OwnerEmailOtp.deleteOne({
      email: normalizedEmail,
      purpose: "register"
    });

    // Save OTP
    await OwnerEmailOtp.create({
      email: normalizedEmail,
      otp: hashedOtp,
      purpose: "register",
      attempts: 0,
      otpSentCount: 1,
      lastSentAt: new Date(),
      expiresAt: new Date(
        Date.now() + 5 * 60 * 1000
      ),
      ipAddress: req.ip
    });

    // Send OTP
    await sendEmail({
      email: normalizedEmail,
      subject: "Your OTP for Owner Registration",
      message: `Your OTP is ${otp}. It will expire in 5 minutes.`
    });

    return res.status(200).json({
      message: "OTP sent successfully"
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const owner = await Owner.findOne({
      email: normalizedEmail
    });

    if (!owner) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    if (!owner.isActive) {
      return res.status(403).json({
        message: "Owner account is inactive"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      owner.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        id: owner._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: "Login successful",
      owner: {
        _id: owner._id,
        name: owner.name,
        email: owner.email,
        phone: owner.phone,
        isVerified: owner.isVerified,
        isActive: owner.isActive
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const loginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const owner = await Owner.findOne({
      email: normalizedEmail
    });

    if (!owner) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    if (!owner.isActive) {
      return res.status(403).json({
        message: "Owner account is inactive"
      });
    }

    const otpRecord = await OwnerEmailOtp.findOne({
      email: normalizedEmail,
      purpose: "login"
    });

    if (!otpRecord) {
      return res.status(400).json({
        message: "OTP expired or not found"
      });
    }

    if (otpRecord.attempts >= 4) {
      await OwnerEmailOtp.deleteOne({
        _id: otpRecord._id
      });

      return res.status(429).json({
        message: "Too many attempts. Please request a new OTP"
      });
    }

    const isOtpValid = await bcrypt.compare(
      otp,
      otpRecord.otp
    );

    if (!isOtpValid) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    const token = jwt.sign(
      {
        id: owner._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000
    });

    await OwnerEmailOtp.deleteOne({
      _id: otpRecord._id
    });

    return res.status(200).json({
      message: "Login successful",
      owner: {
        _id: owner._id,
        name: owner.name,
        email: owner.email,
        phone: owner.phone,
        isVerified: owner.isVerified,
        isActive: owner.isActive
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const createLoginOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const owner = await Owner.findOne({
      email: normalizedEmail
    });

    if (!owner) {
      return res.status(404).json({
        message: "Owner not found"
      });
    }

    if (!owner.isActive) {
      return res.status(403).json({
        message: "Owner account is inactive"
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const hashedOtp = await bcrypt.hash(
      otp,
      10
    );

    await OwnerEmailOtp.deleteOne({
      email: normalizedEmail,
      purpose: "login"
    });

    await OwnerEmailOtp.create({
      email: normalizedEmail,
      otp: hashedOtp,
      purpose: "login",
      attempts: 0,
      otpSentCount: 1,
      lastSentAt: new Date(),
      expiresAt: new Date(
        Date.now() + 5 * 60 * 1000
      ),
      ipAddress: req.ip
    });

    await sendEmail({
      email: normalizedEmail,
      subject: "Your OTP for Owner Login",
      message: `Your OTP is ${otp}. It will expire in 5 minutes.`
    });

    return res.status(200).json({
      message: "Login OTP sent successfully"
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

// Logout
const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
};

// Get current Owner
const getCurrentOwner = async (req, res) => {
  try {
    const owner = await Owner.findById(req.owner.id)
  .select("-password -resetPasswordToken -resetPasswordExpires");

    if (!owner) {
      return res.status(401).json({
        success: false,
        message: "Owner not found"
      });
    }

    if (!owner.isActive) {
      return res.status(403).json({
        success: false,
        message: "Owner account is inactive"
      });
    }

    return res.status(200).json({
      success: true,
      owner
    });

  } catch (error) {
    console.log("GET CURRENT OWNER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const owner = await Owner.findOne({
      email: normalizedEmail
    });

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Owner not found"
      });
    }

    if (!owner.isActive) {
      return res.status(403).json({
        success: false,
        message: "Owner account is inactive"
      });
    }

    const resetToken = jwt.sign(
      {
        id: owner._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    owner.resetPasswordToken = resetToken;
    owner.resetPasswordExpires =
      Date.now() + 60 * 60 * 1000;

    await owner.save();

    console.log("Reset Token:", resetToken);

    const resetUrl =
      `${process.env.CLIENT_URL}/owner/reset-password/${resetToken}`;

    await sendEmail({
      email: owner.email,
      subject: "Owner Password Reset",
      message: `
        <h2>Password Reset Request</h2>
        <p>Hello ${owner.name},</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link expires in 1 hour.</p>
      `
    });

    return res.status(200).json({
      success: true,
      message: "Password reset email sent"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Reset token is required"
      });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters"
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }

    // Verify reset token
    let decoded;

    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token"
      });
    }

    // Find owner using token + expiry
    const owner = await Owner.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: {
        $gt: Date.now()
      }
    });

    if (!owner) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token"
      });
    }

    // Hash new password
    owner.password = await bcrypt.hash(
      password,
      10
    );

    // Invalidate reset token
    owner.resetPasswordToken = null;
    owner.resetPasswordExpires = null;

    await owner.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentOwner,
  forgotPassword,
  resetPassword,
  createOtp,
  createLoginOtp,
  loginOtp
};