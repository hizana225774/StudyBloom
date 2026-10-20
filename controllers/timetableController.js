
const Timetable = require("../models/Timetable");

// Get all timetable entries
exports.getTimetable = async (req, res) => {
  try {
    const entries = await Timetable.find().sort({
      day: 1,
      startTime: 1
    });

    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a timetable entry
exports.createTimetable = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Timetable title is required."
      });
    }

    const entry = await Timetable.create({
      ...req.body,
      title: title.trim()
    });

    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a timetable entry
exports.updateTimetable = async (req, res) => {
  try {
    const entry = await Timetable.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
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

// Delete a timetable entry
exports.deleteTimetable = async (req, res) => {
  try {
    const entry = await Timetable.findByIdAndDelete(req.params.id);

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
