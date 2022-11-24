const express = require("express");
const router = express.Router();

const booksController = require("../controller/books");

// Get all books
router.get("/", booksController.getAllBooks);
// Get book by ID
router.get("/:id", booksController.getBookById);
// Add book to DB
router.post("/", booksController.addBook);
// Update book information
router.put("/:id", booksController.updateBook);
// Delete book from inventory
router.delete("/:id", booksController.deleteBook);

module.exports = router;
