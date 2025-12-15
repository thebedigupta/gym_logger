const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Google Sign-In
router.post("/google", async (req, res) => {
  try {
    const { googleId, email, name, profilePicture } = req.body;

    // Check if user exists
    let user = await User.findOne({ googleId });

    if (!user) {
      // Create new user
      user = new User({
        googleId,
        email,
        name,
        profilePicture,
      });
      await user.save();
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get current user
router.get("/me", (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    res.json({ userId: decoded.userId });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;
