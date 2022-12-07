const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getAllBooks = async (req, res) => {
  if (!req.user) {
    res.status(401);
    res.send("Authentication failed.");
    return;
  }

  const response = await mongodb.getDb().db().collection("books").find();
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
    res.status(401);
    res.send("Authentication failed.");
    return;
  }

  const bookId = new ObjectId(req.params.id);
  const response = await mongodb
    .getDb()
    .db()
    .collection("books")
    .find({ _id: bookId });

  if (!response) {
    res
      .status(500)
      .json(response.error || "An error occurred while getting this book");
  } else {
    response.toArray().then((lists) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(lists[0]);
    });
  }
};

const addBook = async (req, res) => {
  if (!req.user) {
    res.status(401);
    res.send("Authentication failed.");
    return;
  }

  const book = {
    title: req.body.title,
    author: req.body.author,
    yearPublished: req.body.yearPublished,
    format: req.body.format,
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection("books")
    .insertOne(book);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res
      .status(500)
      .json(response.error || "An error occurred while adding a book.");
  }
};

const updateBook = async (req, res) => {
  // console.log("Update book information by ID");
  if (!req.user) {
    res.status(401);
    res.send("Authentication failed.");
    return;
  }

  const bookId = new ObjectId(req.params.id);
  const book = {
    title: req.body.title,
    author: req.body.author,
    yearPublished: req.body.yearPublished,
    format: req.body.format,
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection("books")
    .replaceOne({ _id: bookId }, book);
  if (response.acknowledged) {
    res.status(204).json(response);
  } else {
    res
      .status(500)
      .json(response.error || "An error occurred while updating the book.");
  }
};

const deleteBook = async (req, res) => {
  if (!req.user) {
    res.status(401);
    res.send("Authentication failed.");
    return;
  }

  const bookId = new ObjectId(req.params.id);
  const response = await mongodb
    .getDb()
    .db()
    .collection("books")
    .deleteOne({ _id: bookId }, true);
  if (response.acknowledged) {
    res.status(200).json(response);
  } else {
    res
      .status(500)
      .json(
        response.error || "An error occurred while trying to delete the book."
      );
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
};
