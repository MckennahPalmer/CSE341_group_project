const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getAllMovies = async (req, res) => {
  if (!req.user) {
    res.status(401);
    res.send("Authentication failed.");
    return;
  }

  const response = await mongodb.getCollection("movies").find();
  if (!response) {
    res
      .status(500)
      .json(response.error || "An error occurred while getting all the movies");
  } else {
    response.toArray().then((lists) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(lists);
    });
  }
};

const getMovieById = async (req, res) => {
  if (!req.user) {
    res.status(401).send("Authentication failed.");
    return;
  }
  if (!req.params.id) {
    res.status(400).send("Missing movie id.");
    return;
  }
  const movieId = new ObjectId(req.params.id);

  try {
    const response = await mongodb
      .getCollection("movies")
      .find({ _id: movieId });
    if (!response) {
      res.status(400).send("No movie returned for that id.");
      return;
    } else {
      response.toArray().then((lists) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(lists[0]);
      });
    }
  } catch (error) {
    res.status(500);
    const msg = "An error occurred while getting this movie";
    res.send(msg);
    return;
  }
};

const addMovie = async (req, res) => {
  if (!req.user) {
    res.status(401);
    res.send("Authentication failed.");
    return;
  }

  if (!req.body) {
    res
      .status(400)
      .send(`Invalid request, please provide a movie to add in the body.`);
    return;
  }

  const movie = validateFields(req, res);

  try {
    const response = await mongodb.getCollection("movies").insertOne(movie);
    if (response.acknowledged) {
      response.toArray().then((lists) => {
        res.setHeader("Content-Type", "application/json");
        res.status(201).json(lists[0]);
      });
    } else {
      res.status(400).send("Unknown error adding movie.");
      return;
    }
  } catch (error) {
    res.status(500);
    const msg = "An error occurred while getting this movie";
    res.send(msg);
    return;
  }
};

const updateMovie = async (req, res) => {
  if (!req.user) {
    res.status(401);
    res.send("Authentication failed.");
    return;
  }
  if (!req.params.id) {
    res.status(400).send("Missing param movie id.");
    return;
  }

  if (!req.body) {
    res.status(400).send(`Invalid request, please provide a body.`);
    return;
  }

  const movieId = new ObjectId(req.params.id);
  const movie = validateFields(req, res);

  try {
    const response = await mongodb
      .getCollection("movies")
      .replaceOne({ _id: movieId }, movie);
    if (response.acknowledged) {
      response.toArray().then((lists) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(lists[0]);
      });
    } else {
      res.status(400).send("Unknown error updating movie.");
      return;
    }
  } catch (error) {
    res.status(500);
    const msg = "An error occurred while getting this movie";
    res.send(msg);
    return;
  }
};

const deleteMovie = async (req, res) => {
  if (!req.user) {
    res.status(401);
    res.send("Authentication failed.");
    return;
  }

  const movieId = new ObjectId(req.params.id);

  // const response = await mongodb
  //   .getCollection("movies")
  //   .deleteOne({ _id: movieId }, true);
  // if (response.acknowledged) {
  //   res.status(200).json(response);
  // } else {
  //   res
  //     .status(500)
  //     .json(
  //       response.error || "An error occurred while trying to delete the movie."
  //     );
  // }

  try {
    const response = await mongodb
      .getCollection("movies")
      .deleteOne({ _id: movieId }, true);
    if (response.acknowledged) {
      //res.setHeader("Content-Type", "application/json");
      res.status(204); //no content
    } else {
      res.status(400).send("Unknown error deleting movie.");
      return;
    }
  } catch (error) {
    res.status(500);
    const msg = "An error occurred while deleting this movie";
    res.send(msg);
    return;
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  addMovie,
  updateMovie,
  deleteMovie,
};

function validateFields(req, res) {
  let movie;
  const validFields = ["title", "rating", "yearReleased", "duration", "format"];
  const missingFields = validFields.filter(
    (val) => !Object.keys(req.body).includes(val) || req.body[val] === ""
  );
  if (missingFields.length > 0) {
    res.status(400).send(`Missing field error: ${missingFields}`);
    return;
  } else {
    movie = {
      title: req.body.title,
      rating: req.body.rating,
      yearReleased: req.body.yearReleased,
      duration: req.body.duration,
      format: req.body.format,
    };
  }
  return movie;
}
