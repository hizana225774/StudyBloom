
const mongoose = require("mongoose");
const Event = require("../models/Event");

// Get all events belonging to the logged-in user
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({
      user: req.user.id
    }).sort({ date: 1, time: 1 });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create an event for the logged-in user
exports.createEvent = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Event title is required."
      });
    }

    const event = await Event.create({
      title: title.trim(),
      description: req.body.description || "",
      date: req.body.date || "",
      time: req.body.time || "",
      reminder: req.body.reminder,
      user: req.user.id
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an event belonging to the logged-in user
exports.updateEvent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid event ID."
      });
    }

    const allowedFields = [
      "title",
      "description",
      "date",
      "time",
      "reminder"
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
        message: "Event title is required."
      });
    }

    if (changes.title !== undefined) {
      changes.title = changes.title.trim();
    }

    const event = await Event.findOneAndUpdate(
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

    if (!event) {
      return res.status(404).json({
        message: "Event not found."
      });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an event belonging to the logged-in user
exports.deleteEvent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid event ID."
      });
    }

    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!event) {
      return res.status(404).json({
        message: "Event not found."
      });
    }

    res.status(200).json({
      message: "Event deleted successfully."
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
