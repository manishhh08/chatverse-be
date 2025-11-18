import nodemailer from "nodemailer";
import config from "./config.js";

// Create transporter using config
export const transporter = nodemailer.createTransport({
  host: config.nodemailer.host,
  port: config.nodemailer.port,
  auth: {
    user: config.nodemailer.user,
    pass: config.nodemailer.pass,
  },
});

// Optional: verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Nodemailer connection error:", error);
  } else {
    console.log("✅ Nodemailer ready to send emails");
  }
});

// Email formatter
export const emailFormatter = (to, subject, firstName, link) => ({
  from: `"ChatVerse ⚡" <${config.nodemailer.user}>`,
  to,
  subject,
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Hello ${firstName || "User"},</h2>
      <p>Please click the link below to proceed:</p>
      <a href="${link}" style="
        background-color: #ff6b35;
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        text-decoration: none;
      ">${subject}</a>
      <p>If the button doesn’t work, copy this link into your browser:</p>
      <p>${link}</p>
    </div>
  `,
});
