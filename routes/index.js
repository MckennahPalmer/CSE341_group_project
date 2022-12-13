const router = require("express").Router();

const openCors = require("../middleware/openCors");
const authorizationRoutes = require("./authorization");
const loadUser = require("../middleware/loadUser");
const books = require("./books");
const movies = require("./movies");
const music = require("./music");
const games = require("./games");

router.use(openCors);

router.use("/api-docs", require("./docs"));
router.use("/authorization", authorizationRoutes);
router.use("/api/v1/books", loadUser, books);
router.use("/api/v1/movies", loadUser, movies);
router.use("/api/v1/music", loadUser, music);
router.use("/api/v1/games", loadUser, games);

module.exports = router;
