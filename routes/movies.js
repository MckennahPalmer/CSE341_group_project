const express = require("express");
const router = express.Router();

const moviesController = require("../controllers/movies");
const loadUser = require("../middleware/loadUser");
const validation = require("../middleware/validate");

router.use([loadUser]);

// Get all movies
router.get("/", moviesController.getAllMovies);
// Get movie by ID
router.get("/:id", moviesController.getMovieById);
// Add movie to DB
router.post("/", validation.saveMovie, moviesController.addMovie);
// Update movie information
router.put("/:id", validation.saveMovie, moviesController.updateMovie);
// Delete movie from inventory
router.delete("/:id", moviesController.deleteMovie);

module.exports = router;
