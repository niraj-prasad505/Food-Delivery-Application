const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"SnackDrop" <${process.env.EMAIL}>`,
      to: options.email,
      subject: options.subject,
      text: options.message, // Handles plain string messages like OTPs
      html: options.html || options.message, // Handles formatted HTML templates
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email via Nodemailer:", error);
    throw error;
  }
};

module.exports = sendEmail;