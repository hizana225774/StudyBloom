
const mongoose = require("mongoose");
const Routine = require("../models/Routine");

// Get the logged-in user's routine activities
exports.getRoutines = async (req, res) => {
  try {
    const routines = await Routine.find({
      user: req.user.id
    }).sort({ startTime: 1 });

    res.status(200).json(routines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a routine activity
exports.createRoutine = async (req, res) => {
  try {
    const { title } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "Routine title is required."
      });
    }

    const routine = await Routine.create({
      user: req.user.id,
      title: title.trim(),
      startTime: req.body.startTime || "",
      endTime: req.body.endTime || "",
      category: req.body.category || "personal",
      completed: req.body.completed ?? false,
      day: req.body.day || "everyday"
    });

    res.status(201).json(routine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update only the logged-in user's routine activity
exports.updateRoutine = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid routine activity ID."
      });
    }

    const allowedFields = [
      "title",
      "startTime",
      "endTime",
      "category",
      "completed",
      "day"
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.title !== undefined) {
      if (
        typeof updates.title !== "string" ||
        !updates.title.trim()
      ) {
        return res.status(400).json({
          message: "Routine title is required."
        });
      }

      updates.title = updates.title.trim();
    }

    const routine = await Routine.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id
      },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!routine) {
      return res.status(404).json({
        message: "Routine activity not found."
      });
    }

    res.status(200).json(routine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete only the logged-in user's routine activity
exports.deleteRoutine = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid routine activity ID."
      });
    }

    const routine = await Routine.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!routine) {
      return res.status(404).json({
        message: "Routine activity not found."
      });
    }

    res.status(200).json({
      message: "Routine activity deleted successfully."
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
