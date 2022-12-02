const booksController = require("../controllers/books");

let req, res;

beforeEach(() => {
  req = {};
  send = jest.fn(),
  res = {
    status: jest.fn(() => ({
      send,
    })),
    json: jest.fn(),
  }
});

describe("index()", () => {
  describe("Call all books", () => {

    it('Responds with a 200', () =>{
      booksController.getAllBooks(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("responds with a 401", () => {
      booksController.getAllBooks(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith("Authorization failed.");
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

      booksController.getBookById(req, res);

      expect(res.json).toHaveBeenCalledWith(bookOne);
    });

    it("responds with a 401", () => {
      booksController.getBookById(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith("Authorization failed.");
    });
  });

  describe("Add new book", () => {
    it('Adds book and return successful code', () => {
      booksController.addBook(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("Responds with a 401", () => {
      booksController.addBook(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith("Authorization failed.");
    });

    it("display the error message", () => {
      booksController.addBook(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("An error occurred while adding a book.");
    });
  });

  describe("Update the book", () => {
    it('changes some info and saves it', () =>{
      booksController.updateBook(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("Responds with a 401", () => {
      booksController.updateBook(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith("Authorization failed.");
    });

    it("display the error message", () => {
      booksController.updateBook(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("An error occurred while update the book.");
    });
  });

  describe("Deletes the book", () => {
    it('Removes the book we added earler from the database', () =>{
      booksController.deleteBook(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("Responds with a 401", () => {
      booksController.deleteBook(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith("Authorization failed.");
    });

    it("display the error message", () => {
      booksController.deleteBook(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("An error occurred while trying to delete the book.");
    });
  });
});
