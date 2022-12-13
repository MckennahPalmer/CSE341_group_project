const express = require("express");
const router = express.Router();

const musicController = require("../controllers/music");
const loadUser = require("../middleware/loadUser");
const validation = require("../middleware/validate");

router.use([loadUser]);

// Get all music
router.get("/", musicController.getAllMusic);
// Get music by ID
router.get("/:id", musicController.getMusicById);
// Add music to DB
router.post("/", validation.saveMusic, musicController.addMusic);
// Update music information
router.put("/:id", validation.saveMusic, musicController.updateMusic);
// Delete music from inventory
router.delete("/:id", musicController.deleteMusic);

module.exports = router;
