
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
} = require("../controllers/eventController");

// Require login for every event operation
router.use(authMiddleware);

router.get("/", getEvents);
router.post("/", createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

module.exports = router;
s
