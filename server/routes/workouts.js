const express = require("express");
const Workout = require("../models/Workout");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Helper function to format date and time in 12-hour format
const formatWorkoutDateTime = (workout) => {
  if (!workout.date) return workout;

  const date = new Date(workout.date);
  
  // Add 5.5 hours to convert from UTC to India timezone for display
  const indiaDate = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
  
  const dateStr = indiaDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const timeStr = indiaDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Return with original UTC date but with timezone offset annotation
  // So frontend knows this is India time
  const isoWithTz = indiaDate.toISOString().split('Z')[0] + '+05:30'

  return {
    ...workout.toObject(),
    displayDate: `${dateStr} at ${timeStr}`,
    date: isoWithTz,  // Override date with timezone-aware string for frontend
  };
};

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Get all workouts for current user
router.get("/", verifyToken, async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.userId }).sort({
      date: -1,
    });
    const formattedWorkouts = workouts.map((workout) =>
      formatWorkoutDateTime(workout)
    );
    res.json(formattedWorkouts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single workout
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }
    const formattedWorkout = formatWorkoutDateTime(workout);
    res.json(formattedWorkout);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new workout
router.post("/", verifyToken, async (req, res) => {
  // Convert from ISO string with +05:30 to UTC Date object
  // 2025-12-17T14:30:00+05:30 means 14:30 in India time
  // We need to convert this to UTC: 14:30 - 5:30 = 09:00 UTC
  const receivedDate = new Date(req.body.date)
  
  const workout = new Workout({
    userId: req.userId,
    exercise: req.body.exercise,
    sets: req.body.sets,
    reps: req.body.reps,
    weight: req.body.weight,
    weightUnit: req.body.weightUnit,
    rest: req.body.rest || 60,
    date: receivedDate,  // This will be stored as UTC in MongoDB
    notes: req.body.notes,
    skipDay: req.body.skipDay || false,
  });

  try {
    const newWorkout = await workout.save();
    const formattedWorkout = formatWorkoutDateTime(newWorkout);
    res.status(201).json(formattedWorkout);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a workout
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    if (req.body.exercise) workout.exercise = req.body.exercise;
    if (req.body.sets) workout.sets = req.body.sets;
    if (req.body.reps) workout.reps = req.body.reps;
    if (req.body.weight) workout.weight = req.body.weight;
    if (req.body.weightUnit) workout.weightUnit = req.body.weightUnit;
    if (req.body.rest !== undefined) workout.rest = req.body.rest;
    if (req.body.date) workout.date = req.body.date;
    if (req.body.notes !== undefined) workout.notes = req.body.notes;
    if (req.body.skipDay !== undefined) workout.skipDay = req.body.skipDay;

    const updatedWorkout = await workout.save();
    const formattedWorkout = formatWorkoutDateTime(updatedWorkout);
    res.json(formattedWorkout);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a workout
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }
    res.json({ message: "Workout deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
