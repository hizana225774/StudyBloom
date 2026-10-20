
const express = require("express");
const router = express.Router();

const {
  getTimetable,
  createTimetable,
  updateTimetable,
  deleteTimetable
} = require("../controllers/timetableController");

router.get("/", getTimetable);
router.post("/", createTimetable);
router.put("/:id", updateTimetable);
router.delete("/:id", deleteTimetable);

module.exports = router;
