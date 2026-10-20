
const express = require("express");
const router = express.Router();

const {
  getRoutines,
  createRoutine,
  updateRoutine,
  deleteRoutine
} = require("../controllers/routineController");

router.get("/", getRoutines);
router.post("/", createRoutine);
router.put("/:id", updateRoutine);
router.delete("/:id", deleteRoutine);

module.exports = router;
