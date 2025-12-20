const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

const requiredEnv = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "FEEDBACK_TO"];

router.post("/", async (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Name, email, and message are required." });
  }

  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length) {
    return res.status(500).json({ message: `Feedback not configured. Missing: ${missing.join(", ")}` });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true" || process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.FEEDBACK_FROM || process.env.SMTP_USER,
      to: process.env.FEEDBACK_TO,
      replyTo: email,
      subject: `Localhost Gym feedback from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Feedback send failed:", err.message);
    res.status(500).json({ message: "Unable to send feedback right now." });
  }
});

module.exports = router;
