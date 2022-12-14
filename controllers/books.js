const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getAllBooks = async (req, res) => {
  if (!req.user) {
    res.status(401);
    res.send("Authentication failed.");
    return;
  }

  const response = await mongodb.getCollection("books").find();
  if (!response) {
    res
      .status(500)
      .json(response.error || "An error occurred while getting all the books");
  } else {
    response.toArray().then((lists) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(lists);
    });
  }
};

const getBookById = async (req, res) => {
  if (!req.user) {
    res.status(401).send("Authentication failed.");
    return;
  }
  if (!req.params.id) {
    res.status(400).send("Missing book id.");
    return;
  }
  const bookId = new ObjectId(req.params.id);

  try {
    const response = await mongodb.getCollection("books").find({ _id: bookId });
    if (!response) {
      res.status(400).send("No book returned for that id.");
      return;
    } else {
      response.toArray().then((lists) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(lists[0]);
      });
    }
  } catch (error) {
    res.status(500);
    const msg = "An error occurred while getting this book";
    res.send(msg);
    return;
  }
};

const addBook = async (req, res) => {
  if (!req.user) {
    res.status(401);
    res.send("Authentication failed.");
    return;
  }

  if (!req.body) {
    res
      .status(400)
      .send(`Invalid request, please provide a book to add in the body.`);
    return;
  }

  const book = {
    title: req.body.title,
    author: req.body.author,
    yearPublished: req.body.yearPublished,
    format: req.body.format,
  };

  try {
    const response = await mongodb.getCollection("books").insertOne(book);
    if (response.acknowledged) {
      res.setHeader("Content-Type", "application/json");
      res.status(201).json({ id: response.insertedId });
    } else {
      res.status(400).send("Unknown error adding book.");
      return;
    }
  } catch (error) {
    res.status(500);
    const msg = "An error occurred while adding this book";
    res.send(msg);
    return;
  }
};

const updateBook = async (req, res) => {
  if (!req.user) {
    res.status(401);
    res.send("Authentication failed.");
    return;
  }
  if (!req.params.id) {
    res.status(400).send("Missing param book id.");
    return;
  }

  if (!req.body) {
    res.status(400).send(`Invalid request, please provide a body.`);
    return;
  }

  const bookId = new ObjectId(req.params.id);

  const book = {
    title: req.body.title,
    author: req.body.author,
    yearPublished: req.body.yearPublished,
    format: req.body.format,
  };

  try {
    const response = await mongodb
      .getCollection("books")
      .replaceOne({ _id: bookId }, book);
    if (response.acknowledged) {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json({ id: req.params.id });
    } else {
      res.status(400).send("Unknown error updating book.");
      return;
    }
  } catch (error) {
    res.status(500);
    const msg = "An error occurred while updating this book";
    res.send(msg);
    return;
  }
};

const deleteBook = async (req, res) => {
  if (!req.user) {
    res.status(401);
    res.send("Authentication failed.");
    return;
  }

  const bookId = new ObjectId(req.params.id);

  try {
    const response = await mongodb
      .getCollection("books")
      .deleteOne({ _id: bookId }, true);
    if (response.acknowledged) {
      res.status(200).json(response);
      return;
    } else {
      res.status(400).send("Unknown error deleting book.");
      return;
    }
  } catch (error) {
    res.status(500);
    const msg = "An error occurred while deleting this book";
    res.send(msg);
    return;
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
};
