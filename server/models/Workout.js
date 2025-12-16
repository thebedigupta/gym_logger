const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    exercise: {
      type: String,
      required: function () {
        return !this.skipDay;
      },
    },
    sets: {
      type: Number,
      required: function () {
        return !this.skipDay;
      },
    },
    reps: {
      type: Number,
      required: function () {
        return !this.skipDay;
      },
    },
    weight: {
      type: Number,
      required: function () {
        return !this.skipDay;
      },
    },
    weightUnit: {
      type: String,
      enum: ["kg", "lbs"],
      default: "kg",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: "",
    },
    rest: {
      type: Number,
      default: 60,
      description: "Rest time between sets in seconds"
    },
    skipDay: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workout", workoutSchema);
