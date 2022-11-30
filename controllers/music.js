const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getAllMusic = async (req, res) => {
  // console.log("Getting all music");
  if (!req.user) {
    res.status(401);
    res.send("Authorization failed.");
    return;
  }

  const result = await mongodb.getDb().db().collection("music").find();
  result.toArray().then((lists) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(lists);
  });
};

const getMusicById = async (req, res) => {
  // console.log("Getting music by ID");
  if (!req.user) {
    res.status(401);
    res.send("Authorization failed.");
    return;
  }

  const musicId = new ObjectId(req.params.id);
  const result = await mongodb
    .getDb()
    .db()
    .collection("music")
    .find({ _id: musicId });
  result.toArray().then((lists) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(lists[0]);
  });
};

const addMusic = async (req, res) => {
  // console.log("Add music to inventory");
  if (!req.user) {
    res.status(401);
    res.send("Authorization failed.");
    return;
  }

  const music = {
    artist: req.body.artist,
    album: req.body.album,
    label: req.body.label,
    genre: req.body.genre,
    releaseDate: req.body.releaseDate,
    numSongs: req.body.numSongs,
    format: req.body.format,
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection("music")
    .insertOne(music);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res
      .status(500)
      .json(response.error || "An error occurred while adding a music.");
  }
};

const updateMusic = async (req, res) => {
  // console.log("Update music information by ID");
  if (!req.user) {
    res.status(401);
    res.send("Authorization failed.");
    return;
  }

  const musicId = new ObjectId(req.params.id);
  const music = {
    artist: req.body.artist,
    album: req.body.album,
    label: req.body.label,
    genre: req.body.genre,
    releaseDate: req.body.releaseDate,
    numSongs: req.body.numSongs,
    format: req.body.format,
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection("music")
    .replaceOne({ _id: musicId }, music);
  if (response.acknowledged) {
    res.status(204).json(response);
  } else {
    res
      .status(500)
      .json(response.error || "An error occurred while update the music.");
  }
};

const deleteMusic = async (req, res) => {
  // console.log("Delete music from inventory");
  if (!req.user) {
    res.status(401);
    res.send("Authorization failed.");
    return;
  }

  const musicId = new ObjectId(req.params.id);
  const response = await mongodb
    .getDb()
    .db()
    .collection("music")
    .deleteOne({ _id: musicId }, true);
  if (response.acknowledged) {
    res.status(200).json(response);
  } else {
    res
      .status(500)
      .json(
        response.error || "An error occurred while trying to delete the music."
      );
  }
};

module.exports = {
  getAllMusic,
  getMusicById,
  addMusic,
  updateMusic,
  deleteMusic,
};
