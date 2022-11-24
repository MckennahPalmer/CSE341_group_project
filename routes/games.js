const express = require("express");
const router = express.Router();

const gameController = require("../controller/games");

// Get all games
router.get("/", gameController.getAllGames);
// Get game by ID
router.get("/:id", gameController.getGameById);
// Add game to DB
router.post("/", gameController.addGame);
// Update game information
router.put("/:id", gameController.updateGame);
// Delete game from inventory
router.delete("/:id", gameController.deleteGame);

module.exports = router;
