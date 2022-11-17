const { getClient } = require('../db/mongo_client');
const ObjectId = require('mongodb').ObjectId;

const getAllBooks = async (req, res) => {
  // #swagger.description = 'Get all Puns'
  const coll = getClient().db('media').collection('books');
  const cursor = coll.find({});
  const result = await cursor.toArray();
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(result);
};

module.exports = {
  getAllBooks,

};
