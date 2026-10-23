
const Settings = require("../models/Settings");

// Get settings for the logged-in user
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({
      user: req.user.id
    });

    if (!settings) {
      settings = await Settings.create({
        user: req.user.id,
        name: "",
        theme: "sage",
        notifications: true
      });
    }

    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update settings for the logged-in user
exports.updateSettings = async (req, res) => {
  try {
    const allowedFields = ["name", "theme", "notifications"];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const settings = await Settings.findOneAndUpdate(
      { user: req.user.id },
      {
        $set: updates,
        $setOnInsert: { user: req.user.id }
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    );

    res.status(200).json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
