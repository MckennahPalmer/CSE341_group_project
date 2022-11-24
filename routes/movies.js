const express = require("express");
const router = express.Router();

const moviesController = require("../controller/movies");

// Get all movies
router.get("/", moviesController.getAllMovies);
// Get movie by ID
router.get("/:id", moviesController.getMovieById);
// Add movie to DB
router.post("/", moviesController.addMovie);
// Update movie information
router.put("/:id", moviesController.updateMovie);
// Delete movie from inventory
router.delete("/:id", moviesController.deleteMovie);

module.exports = router;
