
const mongoose = require("mongoose");

const routineSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    startTime: {
      type: String,
      default: ""
    },
    endTime: {
      type: String,
      default: ""
    },
    category: {
      type: String,
      default: "personal"
    },
    completed: {
      type: Boolean,
      default: false
    },
    day: {
      type: String,
      default: "everyday"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Routine", routineSchema);
