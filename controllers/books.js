const { getClient } = require("../db/mongo_client");
const ObjectId = require("mongodb").ObjectId;

const getAllBooks = async (req, res) => {
  const coll = getClient().db("media").collection("books");
  const cursor = coll.find({});
  const result = await cursor.toArray();
  res.setHeader("Content-Type", "application/json");
  res.status(200).json(result);
};

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
  deleteBook,
};
