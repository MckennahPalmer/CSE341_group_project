const validator = require("../helpers/validate");

const validationHelper = (req, res, next, validationRule) => {
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  });
};

const saveBook = (req, res, next) => {
  const validationRule = {
    title: "required|string",
    author: "required|string",
    yearPublished: "required|string",
    format: "required|string",
  };
  validationHelper(req, res, next, validationRule);
};

const saveMovie = (req, res, next) => {
  const validationRule = {
    title: "required|string",
    rating: "required|string",
    yearReleased: "required|string",
    duration: "required|string",
    format: "required|string",
  };
  validationHelper(req, res, next, validationRule);
};

const saveMusic = (req, res, next) => {
  const validationRule = {
    artist: "required|string",
    album: "required|string",
    label: "required|string",
    genre: "required|string",
    releaseDate: "required|string",
    numSongs: "required|string",
    format: "required|string"
    };
  validationHelper(req, res, next, validationRule);
};

const saveGame = (req, res, next) => {
  const validationRule = {
    title: "required|string",
    developer: "required|string",
    publisher: "required|string",
    releaseDate: "required|string",
    platform: "required|string",
  };
  validationHelper(req, res, next, validationRule);
};



module.exports = {
  saveBook,
  saveMovie,
  saveMusic,
  saveGame,
};
