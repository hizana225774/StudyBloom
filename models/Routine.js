
const mongoose = require("mongoose");

const routineSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    startTime: { type: String, default: "" },
    endTime: { type: String, default: "" },
    category: { type: String, default: "personal" },
    completed: { type: Boolean, default: false },
    day: { type: String, default: "everyday" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Routine", routineSchema);
