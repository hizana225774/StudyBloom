
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getSettings,
  updateSettings
} = require("../controllers/settingsController");

// Require login for every settings operation
router.use(authMiddleware);

router.get("/", getSettings);
router.put("/", updateSettings);

module.exports = router;
