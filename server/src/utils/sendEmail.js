const nodemailer = require("nodemailer");


const sendEmail = async (options) => {
    // Create a transporter
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS,
            },

        })

        const mailOptions = {
            from: `"MotoCartel" <${process.env.EMAIL}>`,
            to: options.email,
            subject: options.subject,
            html: options.message,
        };

        await transporter.sendMail(mailOptions);

    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = sendEmail;