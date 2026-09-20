// server/src/utils/sendOtpEmail.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async ({ email, subject, message }) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Email credentials are missing in environment variables (.env)");
    }

    await transporter.sendMail({
      from: `"SnackDrop" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: message,
    });

    console.log("OTP Email sent successfully to:", email);
    return true;
  } catch (error) {
    console.error("Error sending OTP email via Nodemailer:", error);
    throw error;
  }
};

module.exports = sendOtpEmail;