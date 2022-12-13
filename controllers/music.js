const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getAllMusic = async (req, res) => {
  if (!req.user) {
    res.status(401);
    res.send("Authentication failed.");
    return;
  }

  const response = await mongodb.getCollection("music").find();
  if (!response) {
    res
      .status(500)
      .json(response.error || "An error occurred while getting all the music");
  } else {
    response.toArray().then((lists) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(lists);
    });
  }
};

const getMusicById = async (req, res) => {
  if (!req.user) {
    res.status(401).send("Authentication failed.");
    return;
  }
  if (!req.params.id) {
    res.status(400).send("Missing music id.");
    return;
  }
  const musicId = new ObjectId(req.params.id);

  try {
    const response = await mongodb
      .getCollection("music")
      .find({ _id: musicId });
    if (!response) {
      res.status(400).send("No music returned for that id.");
      return;
    } else {
      response.toArray().then((lists) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(lists[0]);
      });
    }
  } catch (error) {
    res.status(500);
    const msg = "An error occurred while getting this music";
    res.send(msg);
    return;
  }
};

const addMusic = async (req, res) => {
  if (!req.user) {
    res.status(401);
    res.send("Authentication failed.");
    return;
  }

  if (!req.body) {
    res
      .status(400)
      .send(`Invalid request, please provide a music to add in the body.`);
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

  try {
    const response = await mongodb.getCollection("music").insertOne(music);
    if (response.acknowledged) {
      response.toArray().then((lists) => {
        res.setHeader("Content-Type", "application/json");
        res.status(201).json(lists[0]);
      });
    } else {
      res.status(400).send("Unknown error adding music.");
      return;
    }
  } catch (error) {
    res.status(500);
    const msg = "An error occurred while getting this music";
    res.send(msg);
    return;
  }
};

const updateMusic = async (req, res) => {
  if (!req.user) {
    res.status(401);
    res.send("Authentication failed.");
    return;
  }
  if (!req.params.id) {
    res.status(400).send("Missing param music id.");
    return;
  }

  if (!req.body) {
    res.status(400).send(`Invalid request, please provide a body.`);
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

  try {
    const response = await mongodb
      .getCollection("music")
      .replaceOne({ _id: musicId }, music);
    if (response.acknowledged) {
      response.toArray().then((lists) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(lists[0]);
      });
    } else {
      res.status(400).send("Unknown error updating music.");
      return;
    }
  } catch (error) {
    res.status(500);
    const msg = "An error occurred while getting this music";
    res.send(msg);
    return;
  }
};

const deleteMusic = async (req, res) => {
  if (!req.user) {
    res.status(401);
    res.send("Authentication failed.");
    return;
  }

  const musicId = new ObjectId(req.params.id);

  // const response = await mongodb
  //   .getCollection("music")
  //   .deleteOne({ _id: musicId }, true);
  // if (response.acknowledged) {
  //   res.status(200).json(response);
  // } else {
  //   res
  //     .status(500)
  //     .json(
  //       response.error || "An error occurred while trying to delete the music."
  //     );
  // }

  try {
    const response = await mongodb
      .getCollection("music")
      .deleteOne({ _id: musicId }, true);
    if (response.acknowledged) {
      //res.setHeader("Content-Type", "application/json");
      res.status(204); //no content
    } else {
      res.status(400).send("Unknown error deleting music.");
      return;
    }
  } catch (error) {
    res.status(500);
    const msg = "An error occurred while deleting this music";
    res.send(msg);
    return;
  }
};

module.exports = {
  getAllMusic,
  getMusicById,
  addMusic,
  updateMusic,
  deleteMusic,
};

function validateFields(req, res) {
  let music;
  const validFields = [
    "artist",
    "album",
    "label",
    "genre",
    "releaseDate",
    "numSongs",
    "format",
  ];
  const missingFields = validFields.filter(
    (val) => !Object.keys(req.body).includes(val) || req.body[val] === ""
  );
  if (missingFields.length > 0) {
    res.status(400).send(`Missing field error: ${missingFields}`);
    return;
  } else {
    music = {
      artist: req.body.artist,
      album: req.body.album,
      label: req.body.label,
      genre: req.body.genre,
      releaseDate: req.body.releaseDate,
      numSongs: req.body.numSongs,
      format: req.body.format,
    };
  }
  return music;
}
