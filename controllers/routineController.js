
const mongoose = require("mongoose");
const Routine = require("../models/Routine");

// Get all routine activities belonging to the logged-in user
exports.getRoutines = async (req, res) => {
  try {
    const routines = await Routine.find({
      user: req.user.id
    }).sort({
      startTime: 1
    });

    res.status(200).json(routines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a routine activity for the logged-in user
exports.createRoutine = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "Routine title is required."
      });
    }

    const routine = await Routine.create({
      title: title.trim(),
      description: req.body.description || "",
      startTime: req.body.startTime || "",
      endTime: req.body.endTime || "",
      days: req.body.days || [],
      user: req.user.id
    });

    res.status(201).json(routine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a routine activity belonging to the logged-in user
exports.updateRoutine = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid routine activity ID."
      });
    }

    const allowedFields = [
      "title",
      "description",
      "startTime",
      "endTime",
      "days"
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
        message: "Routine title is required."
      });
    }

    if (changes.title !== undefined) {
      changes.title = changes.title.trim();
    }

    const routine = await Routine.findOneAndUpdate(
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

// Delete a routine activity belonging to the logged-in user
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
