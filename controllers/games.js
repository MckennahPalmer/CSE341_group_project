const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getAllGames = async (req, res) => {
  // console.log("Getting all games");
  if (!req.user) {
    res.status(401);
    res.send("Authorization failed.");
    return;
  }

  const response = await mongodb.getCollection("games").find();
  if (!response) {
    res
      .status(500)
      .json(response.error || "An error occurred while getting all the games");
  } else {
    response.toArray().then((lists) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(lists);
    });
  }
};

const getGameById = async (req, res) => {
  // console.log("Getting games by ID");
  if (!req.user) {
    res.status(401);
    res.send("Authorization failed.");
    return;
  }

  const gameId = new ObjectId(req.params.id);
  const response = await mongodb
    .getCollection("games")
    .find({ _id: gameId });
  if (!response) {
    res
      .status(500)
      .json(response.error || "An error occurred while getting this game");
  } else {
    response.toArray().then((lists) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(lists[0]);
    });
  }
};

const addGame = async (req, res) => {
  // console.log("Add games to inventory");
  if (!req.user) {
    res.status(401);
    res.send("Authorization failed.");
    return;
  }

  const game = {
    title: req.body.title,
    developer: req.body.developer,
    publisher: req.body.publisher,
    releaseDate: req.body.releaseDate,
    platform: req.body.platform,
  };
  const response = await mongodb
    .getCollection("games")
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
  // console.log("Update games information by ID");
  if (!req.user) {
    res.status(401);
    res.send("Authorization failed.");
    return;
  }

  const gameId = new ObjectId(req.params.id);
  const game = {
    title: req.body.title,
    developer: req.body.developer,
    publisher: req.body.publisher,
    releaseDate: req.body.releaseDate,
    platform: req.body.platform,
  };
  const response = await mongodb
    .getCollection("games")
    .replaceOne({ _id: gameId }, game);
  if (response.acknowledged) {
    res.status(204).json(response);
  } else {
    res
      .status(500)
      .json(response.error || "An error occurred while update the game.");
  }
};

const deleteGame = async (req, res) => {
  // console.log("Delete games from inventory");
  if (!req.user) {
    res.status(401);
    res.send("Authorization failed.");
    return;
  }

  const gameId = new ObjectId(req.params.id);
  const response = await mongodb
    .getCollection("games")
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
