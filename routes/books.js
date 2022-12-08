const express = require("express");
const router = express.Router();

const booksController = require("../controllers/books");
const loadUser = require("../middleware/loadUser");
const validation = require("../middleware/validate");

router.use([loadUser]);

// Get all books
router.get("/", booksController.getAllBooks);
// Get book by ID
router.get("/:id", booksController.getBookById);
// Add book to DB
router.post("/", validation.saveBook, booksController.addBook);
// Update book information
router.put("/:id", validation.saveBook, booksController.updateBook);
// Delete book from inventory
router.delete("/:id", booksController.deleteBook);

module.exports = router;
