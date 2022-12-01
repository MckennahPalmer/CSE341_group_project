const { it, default: test } = require('node:test')
const booksController = require("../controllers/books");

describe("Books Tests", () => {

  it('Call all books', () =>{
    const result = mongodb.getDb().db().collection("books").find();
    expect(booksController.getAllBooks(result)).toBe(res.status(200));

  });

  it('Retrieve a book by the OId', () =>{
    const Id = '637ee05926a634d0f54729f8';
    const bookOne = [{
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        yearPublished: "1960",
        format: "Paperback"
      }];

    expect(booksController.getBookById(Id).toBe(bookOne));

  });

  it('Add a new book to the collection', () =>{
    expect(booksController.getAllBooks(res.status(200))).toBe(json(lists));
  });

  it('Update the book', () =>{
    expect(booksController.getAllBooks(res.status(200))).toBe(json(lists));
  });

  it('Delete the book', () =>{
    expect(booksController.getAllBooks(res.status(200))).toBe(json(lists));
  });
});
