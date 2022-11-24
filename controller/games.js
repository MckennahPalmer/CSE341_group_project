const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getAllGames = async (req, res) => {
  // console.log("Getting all music");
  const result = await mongodb.getDb().db().collection("games").find();
  result.toArray().then((lists) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(lists);
  });
};

const getGameById = async (req, res) => {
  // console.log("Getting music by ID");
  const gameId = new ObjectId(req.params.id);
  const result = await mongodb
    .getDb()
    .db()
    .collection("games")
    .find({ _id: gameId });
  result.toArray().then((lists) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(lists[0]);
  });
};

const addGame = async (req, res) => {
  // console.log("Add music to inventory");
  const game = {
    title: req.body.title,
    developer: req.body.developer,
    publisher: req.body.publisher,
    releaseDate: req.body.releaseDate,
    platform: req.body.platform,
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection("games")
    .insertOne(game);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res
      .status(500)
      .json(response.error || "An error occurred while adding a game.");
  }
};

const updateGame = async (req, res) => {
  // console.log("Update music information by ID");
  const gameId = new ObjectId(req.params.id);
  const game = {
    title: req.body.title,
    developer: req.body.developer,
    publisher: req.body.publisher,
    releaseDate: req.body.releaseDate,
    platform: req.body.platform,
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection("games")
    .replaceOne({ _id: gameId }, game);
  musicController;
  if (response.acknowledged) {
    res.status(204).json(response);
  } else {
    res
      .status(500)
      .json(response.error || "An error occurred while update the game.");
  }
};

const deleteGame = async (req, res) => {
  // console.log("Delete music from inventory");
  const gameId = new ObjectId(req.params.id);
  const response = await mongodb
    .getDb()
    .db()
    .collection("games")
    .deleteOne({ _id: gameId }, true);
  if (response.acknowledged) {
    res.status(200).json(response);
  } else {
    res
      .status(500)
      .json(
        response.error || "An error occurred while trying to delete the game."
      );
  }
};

module.exports = {
  getAllGames,
  getGameById,
  addGame,
  updateGame,
  deleteGame,
};
