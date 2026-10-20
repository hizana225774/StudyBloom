
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Import all route files
const taskRoutes = require("./routes/taskRoutes");
const eventRoutes = require("./routes/eventRoutes");
const timetableRoutes = require("./routes/timetableRoutes");
const routineRoutes = require("./routes/routineRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "StudyBloom backend is running!",
    status: "success"
  });
});

// API routes
app.use("/api/tasks", taskRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/routines", routineRoutes);
app.use("/api/settings", settingsRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    message: "API route not found."
  });
});

// Connect to MongoDB and start the server
async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `StudyBloom server running at http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("Could not start StudyBloom:", error.message);
    process.exit(1);
  }
}

startServer();

