
const mongoose = require("mongoose");
const Timetable = require("../models/Timetable");

// Get all timetable entries belonging to the logged-in user
exports.getTimetable = async (req, res) => {
  try {
    const entries = await Timetable.find({
      user: req.user.id
    }).sort({
      day: 1,
      startTime: 1
    });

    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a timetable entry for the logged-in user
exports.createTimetable = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "Timetable title is required."
      });
    }

    const entry = await Timetable.create({
      title: title.trim(),
      subject: req.body.subject || "",
      day: req.body.day || "",
      startTime: req.body.startTime || "",
      endTime: req.body.endTime || "",
      location: req.body.location || "",
      user: req.user.id
    });

    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a timetable entry belonging to the logged-in user
exports.updateTimetable = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid timetable entry ID."
      });
    }

    const allowedFields = [
      "title",
      "subject",
      "day",
      "startTime",
      "endTime",
      "location"
    ];

    const changes = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        changes[field] = req.body[field];
      }
    });

    if (
      changes.title !== undefined &&
      (typeof changes.title !== "string" || !changes.title.trim())
    ) {
      return res.status(400).json({
        message: "Timetable title is required."
      });
    }

    if (changes.title !== undefined) {
      changes.title = changes.title.trim();
    }

    const entry = await Timetable.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id
      },
      changes,
      {
        new: true,
        runValidators: true
      }
    );

    if (!entry) {
      return res.status(404).json({
        message: "Timetable entry not found."
      });
    }

    res.status(200).json(entry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a timetable entry belonging to the logged-in user
exports.deleteTimetable = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid timetable entry ID."
      });
    }

    const entry = await Timetable.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!entry) {
      return res.status(404).json({
        message: "Timetable entry not found."
      });
    }

    res.status(200).json({
      message: "Timetable entry deleted successfully."
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
