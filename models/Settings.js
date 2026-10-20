
const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    theme: { type: String, default: "sage" },
    notifications: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
