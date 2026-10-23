
const mongoose = require("mongoose");
const Task = require("../models/Task");

// Get tasks belonging only to the logged-in user
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Unable to retrieve tasks." });
  }
};

// Create a task for the logged-in user
exports.createTask = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required.",
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description: req.body.description || "",
      subject: req.body.subject || "",
      dueDate: req.body.dueDate || "",
      priority: req.body.priority || "Medium",
      completed: Boolean(req.body.completed),
      user: req.user.id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: "Unable to create task." });
  }
};

// Update only a task owned by the logged-in user
exports.updateTask = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID." });
    }

    const allowedFields = [
      "title",
      "description",
      "subject",
      "dueDate",
      "priority",
      "completed",
    ];

    const changes = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        changes[field] = req.body[field];
      }
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      changes,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: "Unable to update task." });
  }
};

// Delete only a task owned by the logged-in user
exports.deleteTask = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID." });
    }

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to delete task." });
  }
};
