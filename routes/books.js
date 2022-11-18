const express = require('express');
const router = express.Router();

const booksController = require('../controllers/books');

router.get('/', booksController.getAllBooks);
router.delete('/:id', booksController.deleteBook);

module.exports = router;
