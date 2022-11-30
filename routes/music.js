const express = require("express");
const router = express.Router();

const musicController = require("../controllers/music");
const loadUser = require("../middleware/loadUser");

router.use([loadUser]);

// Get all music
router.get("/", musicController.getAllMusic);
// Get music by ID
router.get("/:id", musicController.getMusicById);
// Add music to DB
router.post("/", musicController.addMusic);
// Update music information
router.put("/:id", musicController.updateMusic);
// Delete music from inventory
router.delete("/:id", musicController.deleteMusic);

module.exports = router;
