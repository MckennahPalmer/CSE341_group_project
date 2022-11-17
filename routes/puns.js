const express = require('express');
const router = express.Router();

const { getAllBooks } = require('../controllers/puns');

router.get('/', getAllBooks);

module.exports = router;
