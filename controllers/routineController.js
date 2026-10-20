
const Routine = require("../models/Routine");

// Get all routine activities
exports.getRoutines = async (req, res) => {
  try {
    const routines = await Routine.find().sort({
      startTime: 1
    });

    res.status(200).json(routines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a routine activity
exports.createRoutine = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Routine title is required."
      });
    }

    const routine = await Routine.create({
      ...req.body,
      title: title.trim()
    });

    res.status(201).json(routine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a routine activity
exports.updateRoutine = async (req, res) => {
  try {
    const routine = await Routine.findByIdAndUpdate(
      req.params.id,
      req.body,
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

// Delete a routine activity
exports.deleteRoutine = async (req, res) => {
  try {
    const routine = await Routine.findByIdAndDelete(req.params.id);

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
