import nodemailer from "nodemailer";

const sendEmail = async ({ email, subject, message, html }) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Email credentials are missing in .env file");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();

    const mailOptions = {
      from: `Telemed Admin <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      text: message,
      html: html || `<p>${message}</p>`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully:", info.response);

  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
  }
};

export default sendEmail;