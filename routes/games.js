const express = require("express");
const router = express.Router();

const gameController = require("../controllers/games");
const loadUser = require("../middleware/loadUser");
const validation = require("../middleware/validate");


router.use([loadUser]);

// Get all games
router.get("/", gameController.getAllGames);
// Get game by ID
router.get("/:id", gameController.getGameById);
// Add game to DB
router.post("/", validation.saveGame, gameController.addGame);
// Update game information
router.put("/:id", validation.saveGame, gameController.updateGame);
// Delete game from inventory
router.delete("/:id", gameController.deleteGame);

module.exports = router;
