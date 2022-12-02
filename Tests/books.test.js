//const { it, default: test, beforeEach } = require('node:test')
const booksController = require("../controllers/books");

let req, res;

beforeEach(() => {
  req = {};
  send = jest.fn(),
  res = {
    status: jest.fn(() => {
      send
    }),
    json: jest.nf(),
  }
});

describe("Books Tests", () => {

  describe("Call all books", () => {
    beforeEach(() => {
      //might need this for authentication later.
    });

    it('Responds with a 200', () =>{
      booksController.index(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("responds with a 401", () => {
      booksController.index(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

  });

  describe("Retrieve a book by the OId", () => {
    it('responds with the json file of the book', () => {
      const Id = '637ee05926a634d0f54729f8';
      const bookOne = [{
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        yearPublished: "1960",
        format: "Paperback"
      }];

      expect(booksController.getBookById(Id).toBe(bookOne));
    });

    it("responds with the proper error message", () => {});
  });

  describe("Add new book", () => {
    it('Adds book and return successful code', () => {
      expect(booksController.getAllBooks(res.status(200))).toBe(json(lists));
    });

    it("display the error message", () => {});
  });

  describe("Update the book", () => {
    it('changes some info and saves it', () =>{
      expect(booksController.getAllBooks(res.status(200))).toBe(json(lists)); 
    });

    it("display the error message", () => {});
  });

  describe("Deletes the book", () => {
    it('Removes the book we added earler from the database', () =>{
      expect(booksController.getAllBooks(res.status(200))).toBe(json(lists));
    });

    it("display the error message", () => {});
  });
});
