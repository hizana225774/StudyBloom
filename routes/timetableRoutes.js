
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getTimetable,
  createTimetable,
  updateTimetable,
  deleteTimetable
} = require("../controllers/timetableController");

// Require login for every timetable operation
router.use(authMiddleware);

router.get("/", getTimetable);
router.post("/", createTimetable);
router.put("/:id", updateTimetable);
router.delete("/:id", deleteTimetable);

module.exports = router;
