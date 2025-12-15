const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Workout = require("./models/Workout");

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

// Sample exercises
const exercises = [
  "Bench Press",
  "Squats",
  "Deadlift",
  "Pull-ups",
  "Barbell Rows",
  "Overhead Press",
  "Leg Press",
  "Dumbbell Curls",
  "Tricep Dips",
  "Lat Pulldowns",
];

// Generate random workout data
const generateWorkoutData = (userId, startDate) => {
  const workouts = [];
  let currentDate = new Date(startDate);
  const today = new Date();

  while (currentDate <= today) {
    // Randomly skip some days (about 30% skip rate)
    const shouldSkip = Math.random() < 0.3;

    if (shouldSkip) {
      // Add skip day
      workouts.push({
        userId: userId,
        skipDay: true,
        date: new Date(currentDate),
      });
    } else {
      // Add workout (about 70% chance on non-skip days)
      if (Math.random() < 0.7) {
        const exercise =
          exercises[Math.floor(Math.random() * exercises.length)];
        const sets = Math.floor(Math.random() * 3) + 3; // 3-5 sets
        const reps = Math.floor(Math.random() * 8) + 8; // 8-15 reps
        const weight = Math.floor(Math.random() * 50) + 20; // 20-70 kg
        const notes = [
          "Great workout today!",
          "Felt strong",
          "Good form",
          "Need to increase weight",
          "Felt a bit tired",
          "Great pump!",
          "",
        ];

        workouts.push({
          userId: userId,
          exercise: exercise,
          sets: sets,
          reps: reps,
          weight: weight,
          weightUnit: "kg",
          notes: notes[Math.floor(Math.random() * notes.length)],
          date: new Date(currentDate),
          skipDay: false,
        });
      }
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return workouts;
};

async function insertDummyData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    // Get the Bedi Gupta user (the logged-in user)
    let user = await User.findOne({ email: "bedigupta76@gmail.com" });

    if (!user) {
      console.log(
        "❌ Bedi Gupta user not found. Please log in with Google first."
      );
      process.exit(1);
    }

    console.log(`✅ Using user: ${user.name} (${user.email})`);

    // Clear existing workouts for this user
    await Workout.deleteMany({ userId: user._id });
    console.log("✅ Cleared existing workouts");

    // Generate dummy data from 6 months ago
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const dummyWorkouts = generateWorkoutData(user._id, sixMonthsAgo);
    console.log(`📊 Generated ${dummyWorkouts.length} dummy workouts`);

    // Insert all workouts
    await Workout.insertMany(dummyWorkouts);
    console.log(`✅ Inserted ${dummyWorkouts.length} workouts into database`);

    // Show stats
    const totalWorkouts = await Workout.countDocuments({ userId: user._id });
    const skipDays = await Workout.countDocuments({
      userId: user._id,
      skipDay: true,
    });
    const actualWorkouts = totalWorkouts - skipDays;

    console.log("\n📈 Dummy Data Statistics:");
    console.log(`   Total Entries: ${totalWorkouts}`);
    console.log(`   Actual Workouts: ${actualWorkouts}`);
    console.log(`   Skip Days: ${skipDays}`);
    console.log(`\n🔐 User: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   User ID: ${user._id}`);

    console.log("\n✨ Dummy data inserted successfully!");
    console.log("🔄 Refresh your browser to see the graphs!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error inserting dummy data:", error);
    process.exit(1);
  }
}

insertDummyData();
