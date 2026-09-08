const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async ({ email, subject, message }) => {
  try {
    await transporter.sendMail({
      from: `"MotoCartel" <${process.env.EMAIL}>`,
      to: email,
      subject,
      html: message,
    });

    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};

module.exports = sendOtpEmail;