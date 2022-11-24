const router = require("express").Router();

// router.use("/", require("./books"));
router.use("/books", require("./books"));
router.use("/movies", require("./movies"));
router.use("/music", require("./music"));
router.use("/games", require("./games"));
router.use("/api-docs", require("./docs"));

module.exports = router;
