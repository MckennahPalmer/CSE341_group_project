const { platform } = require("os");
const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getAllGames = async (req, res) => {
  if (!req.user) {
    res.status(401);
    res.send("Authentication failed.");
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
    res.send("Authentication failed.");
    return;
  }
  if (!req.params.id) {
    res.status(400).send("Missing game id.");
    return;
  }
  const gameId = new ObjectId(req.params.id);

  try {
    const response = await mongodb.getCollection("games").find({ _id: gameId });
    if (!response) {
      res.status(400).send("No game returned for that id.");
      return;
    } else {
      response.toArray().then((lists) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(lists[0]);
      });
    }
  } catch (error) {
    res.status(500);
    const msg = "An error occurred while getting this game";
    res.send(msg);
    return;
  }
};

const addGame = async (req, res) => {
  if (!req.user) {
    res.status(401);
    res.send("Authentication failed.");
    return;
  }

  if (!req.body) {
    res
      .status(400)
      .send(`Invalid request, please provide a game to add in the body.`);
    return;
  }

  const game = validateFields(req, res);

  // const game = {
  //   title: req.body.title,
  //   developer: req.body.developer,
  //   publisher: req.body.publisher,
  //   releaseDate: req.body.releaseDate,
  //   platform: req.body.platform,
  // };

  try {
    const response = await mongodb.getCollection("games").insertOne(game);
    if (response.acknowledged) {
      response.toArray().then((lists) => {
        res.setHeader("Content-Type", "application/json");
        res.status(201).json(lists[0]);
      });
    } else {
      res.status(400).send("Unknown error adding game.");
      return;
    }
  } catch (error) {
    res.status(500);
    const msg = "An error occurred while getting this game";
    res.send(msg);
    return;
  }
};

const updateGame = async (req, res) => {
  if (!req.user) {
    res.status(401);
    res.send("Authentication failed.");
    return;
  }
  if (!req.params.id) {
    res.status(400).send("Missing param game id.");
    return;
  }

  if (!req.body) {
    res.status(400).send(`Invalid request, please provide a body.`);
    return;
  }

  const gameId = new ObjectId(req.params.id);

  const game = validateFields(req, res);

  // const game = {
  //   title: req.body.title,
  //   developer: req.body.developer,
  //   publisher: req.body.publisher,
  //   releaseDate: req.body.releaseDate,
  //   platform: req.body.platform,
  // };

  try {
    const response = await mongodb
      .getCollection("games")
      .replaceOne({ _id: gameId }, game);
    if (response.acknowledged) {
      response.toArray().then((lists) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(lists[0]);
      });
    } else {
      res.status(400).send("Unknown error updating game.");
      return;
    }
  } catch (error) {
    res.status(500);
    const msg = "An error occurred while getting this game";
    res.send(msg);
    return;
  }
};

const deleteGame = async (req, res) => {
  if (!req.user) {
    res.status(401);
    res.send("Authentication failed.");
    return;
  }

  const gameId = new ObjectId(req.params.id);

  try {
    const response = await mongodb
      .getCollection("games")
      .deleteOne({ _id: gameId }, true);
    if (response.acknowledged) {
      //res.setHeader("Content-Type", "application/json");
      res.status(204); //no content
    } else {
      res.status(400).send("Unknown error deleting game.");
      return;
    }
  } catch (error) {
    res.status(500);
    const msg = "An error occurred while deleting this Game";
    res.send(msg);
    return;
  }
};

module.exports = {
  getAllGames,
  getGameById,
  addGame,
  updateGame,
  deleteGame,
};

function validateFields(req, res) {
  let game;
  const validFields = [
    "title",
    "developer",
    "publisher",
    "releaseDate",
    "platform",
  ];
  const missingFields = validFields.filter(
    (val) => !Object.keys(req.body).includes(val) || req.body[val] === ""
  );
  if (missingFields.length > 0) {
    res.status(400).send(`Missing field error: ${missingFields}`);
    return;
  } else {
    game = {
      title: req.body.title,
      developer: req.body.developer,
      publisher: req.body.publisher,
      releaseDate: req.body.releaseDate,
      platform: req.body.platform,
    };
  }
  return game;
}
