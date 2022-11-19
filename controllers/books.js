const { getClient } = require("../db/mongo_client");
const ObjectId = require("mongodb").ObjectId;

const getAllBooks = async (req, res) => {
  const coll = getClient().db("media").collection("books");
  const cursor = coll.find({});
  const result = await cursor.toArray();
  res.setHeader("Content-Type", "application/json");
  res.status(200).json(result);
};

//GetById
const getById = async (req, res) => {
  // #swagger.description = 'Get a book by ID'
  if (!req.params.id) {
    throw Error('Error: Id required!');
  }
  const coll = getClient().db('media').collection('books');
  const query = { _id: ObjectId(req.params.id) };
  const book = await coll.findOne(query);
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(book);
};

//GetByTitle

//GetByGenre

//PostPun
const createBook = async (req, res) => {
  // #swagger.description = 'Create a Book Document'
  const Book = {
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    summary: req.body.summary
  };
  const response = await getClient().db('media').collection('books').insertOne(book);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res.status(500).json(response.error || 'Some error occurred while creating the new book document.');
  }
};

//PostByID?

//PostByUpload?

//PutBook or our update function

const deleteBook = async (req, res) => {
  const userId = new ObjectId(req.params.id);

  const response = await mongodb
    .getDb()
    .db("media")
    .collection("books")
    .remove({ _id: userId }, true);

  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || "We got an error here");
  }
};

module.exports = {
  getAllBooks,
  getById,
  createBook,
  deleteBook,
};
