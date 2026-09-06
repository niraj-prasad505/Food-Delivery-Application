const User = require("../models/User-model");
const EmailOtp = require("../models/EmailOtp-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const UserPreference = require("../models/UserPreference-model");

// Register
const register = async (req, res) => {
  try {
    const {
      fullname,
      email,
      otp,
      password,
      confirmPassword
    } = req.body;

    if (
      !fullname ||
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

    // Check if user already exists
    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Find OTP record
    const otpRecord = await EmailOtp.findOne({
      email: normalizedEmail,
      purpose: "register"
    });

    if (!otpRecord) {
      return res.status(400).json({
        message: "OTP expired or not found"
      });
    }

    // Compare entered OTP with hashed OTP
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
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      fullname: fullname.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "user"
    });

    // Create user preferences
    await UserPreference.create({
      user: newUser._id
    });

    // OTP is no longer needed
    await EmailOtp.deleteOne({
      _id: otpRecord._id
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const createOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP before storing
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Remove previous OTP for this email
    await EmailOtp.deleteOne({
      email: normalizedEmail
    });

    // Create new OTP
    await EmailOtp.create({
      email: normalizedEmail,
      otp: hashedOtp,
      purpose: "register",
      attempts: 0,
      otpSentCount: 1,
      lastSentAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      ipAddress: req.ip
    });

    await sendEmail({
      email: normalizedEmail,
      subject: "Your OTP for Registration",
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

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/"
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        picture: user.picture
      }
    });

  } catch (error) {
    res.status(500).json({
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

    // Check user
    const user = await User.findOne({
      email: normalizedEmail
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    // Find OTP
    const otpRecord = await EmailOtp.findOne({
      email: normalizedEmail
    });

    if (!otpRecord) {
      return res.status(400).json({
        message: "OTP expired or not found"
      });
    }

    // Check OTP attempts
    if (otpRecord.attempts >= 4) {
      await EmailOtp.deleteOne({
        _id: otpRecord._id
      });

      return res.status(429).json({
        message: "Too many attempts. Please request a new OTP"
      });
    }

    // Compare entered OTP with hashed OTP
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

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/"
    });

    // Delete OTP after successful login
    await EmailOtp.deleteOne({
      _id: otpRecord._id
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        picture: user.picture
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

    // Check if user exists
    const user = await User.findOne({
      email: normalizedEmail
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Hash OTP
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Remove previous OTP
    await EmailOtp.deleteOne({
      email: normalizedEmail
    });

    // Create new OTP
    await EmailOtp.create({
      email: normalizedEmail,
      otp: hashedOtp,
      purpose: "login",
      attempts: 0,
      otpSentCount: 1,
      lastSentAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      ipAddress: req.ip
    });

    // Send OTP
    await sendEmail({
      email: normalizedEmail,
      subject: "Your OTP for Login",
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
    secure: false,
    sameSite: "lax",
    path: "/"
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
};


// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Not authenticated"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id)
      .select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};


// Forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();

    const resetUrl =
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail({
      email: user.email,
      subject: "Password Reset",
      message: `
                <h2>Password Reset Request</h2>
                <p>Hello ${user.fullname},</p>
                <p>Click the link below to reset your password:</p>
                <a href="${resetUrl}">Reset Password</a>
                <p>This link expires in 1 hour.</p>
            `
    });

    res.status(200).json({
      message: "Password reset email sent"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters"
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match"
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token"
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json({
      message: "Password reset successful"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  createOtp,
  createLoginOtp,
  loginOtp
};