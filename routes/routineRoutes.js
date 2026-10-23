
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getRoutines,
  createRoutine,
  updateRoutine,
  deleteRoutine
} = require("../controllers/routineController");

// Require login for every routine operation
router.use(authMiddleware);

router.get("/", getRoutines);
router.post("/", createRoutine);
router.put("/:id", updateRoutine);
router.delete("/:id", deleteRoutine);

module.exports = router;
