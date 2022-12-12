const { title } = require("process");
const booksController = require("../controllers/books");
const mongodb = require("../db/connect");

let req, res, send;

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn();
  res.setHeader = jest.fn();
  return res;
};

beforeEach(() => {
  jest.resetAllMocks();
  req = {}; // No user defined in the request
  res = mockResponse();
});

// This test works
describe("getAllBooks()", () => {
  describe("When no user is logged in", () => {
    beforeEach(() => {
      req.user = undefined;
    });

    it("Responds with a 401, 'Authentication failed.'", async () => {
      await booksController.getAllBooks(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith("Authentication failed.");
    });
  });

  describe("Retrieve a book by the Id", () => {
    it("Responds with the json file of the book", async () => {
      const req = {
        user: "mockUser",
        params: { id: "637ee05926a634d0f54729f8" },
      };

      const bookOne = [
        {
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          yearPublished: "1960",
          format: "Paperback",
        },
      ];

      mongodb.getCollection = jest.fn(() => ({
        find: jest.fn(() => ({
          toArray: () => Promise.resolve(bookOne), // setting the result of the query to the contents of bookOne
        })),
      }));

      await booksController.getBookById(req, res);
      expect(res.setHeader).toHaveBeenCalledWith(
        "Content-Type",
        "application/json"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(bookOne[0]);
    });

    it("Responds with 401, 'Authentication failed.'", async () => {
      await booksController.getBookById(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send.mock.calls.length).toBe(1);
      expect(res.send).toHaveBeenCalledWith("Authentication failed.");
    });

    it("Responds with 400, missing book id", async () => {
      const req = {
        user: "mockUser",
        params: {},
      };
      await booksController.getBookById(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Missing book id.");
    });

    it("Responds with 400, No book returned for that id", async () => {
      const req = {
        user: "mockUser",
        params: { id: "637ee05926a634d0f54729f8" },
      };

      mongodb.getCollection = jest.fn(() => ({
        find: jest.fn(() => undefined), // setting the result of the query to undefined
      }));

      await booksController.getBookById(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("No book returned for that id.");
    });

    it("Responds with 500, the DB is not initialized", async () => {
      const req = {
        user: "mockUser",
        params: { id: "637ee05926a634d0f54729f8" },
      };
      const res = mockResponse();

      await booksController.getBookById(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        "An error occurred while getting this book"
      );
    });
  });

  describe("Add new book", () => {

    it("Adds book and return successful code", async () => {
      const req = {
        user: "mockUser",
        params: {}
      }; 

      /*const book = [
        {
          title: req.body.title,
          author: req.body.author,
          yearPublished: req.body.yearPublished,
          format: req.body.format
        }
      ]*/

      const bookTest = [
        {
          title: "The Fellowship of the Ring",
          author: "J. R. R. Tolkien",
          yearPublished: "1954",
          format: "Paperback",
        },
      ];

      // const book = {
      //   title: req.body.title,
      //   author: req.body.author,
      //   yearPublished: req.body.yearPublished,
      //   format: req.body.format
      // }

      await booksController.addBook(req, res);

      mongodb.getCollection = jest.fn(() => ({
        insertOne: jest.fn(() => ({
          toArray: () => Promise.resolve(bookTest), // setting the result of the query to the contents of bookOne
        })),
      }));

      //await booksController.addBook(req, res);
      expect(res.setHeader).toBe(
        "Content-Type",
        "application/json"
      );
      expect(res.status).toBe(200);
      expect(res.json).toBe(bookTest[0]);
    });
      
    it("Responds with 401, 'Authentication failed.'", async () => {
      await booksController.addBook(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send.mock.calls.length).toBe(1);
      expect(res.send).toHaveBeenCalledWith("Authentication failed.");
    });

    xit("Responds with 400, missing field", async () => {
      const req = {
        user: "mockUser",
        params: {},
      };
      await booksController.addBook(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Missing book id.");
    });

    xit("Responds with 500, the DB is not initialized", async () => {
      const req = {
        user: "mockUser",
        params: {},
      };
      const res = mockResponse();

      await booksController.addBook(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        "An error occurred while getting this book"
      );
    });
  });

  describe("Update the book", () => {
    xit("changes some info and saves it", () => {
      booksController.updateBook(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("Responds with 401, 'Authentication failed.'", async () => {
      await booksController.updateBook(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send.mock.calls.length).toBe(1);
      expect(res.send).toHaveBeenCalledWith("Authentication failed.");
    });

    xit("Responds with 400, missing field", async () => {
      const req = {
        user: "mockUser",
        params: {},
      };
      await booksController.updateBook(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Missing book id.");
    });

    xit("Responds with 500, the DB is not initialized", async () => {
      const req = {
        user: "mockUser",
        params: {},
      };
      const res = mockResponse();

      await booksController.updateBook(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("An error occurred while getting this book");
    });
  });

  describe("Deletes the book", () => {
    xit("Removes the book we added earler from the database", () => {
      booksController.deleteBook(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("Responds with 401, 'Authentication failed.'", async () => {
      await booksController.deleteBook(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send.mock.calls.length).toBe(1);
      expect(res.send).toHaveBeenCalledWith("Authentication failed.");
    });

    xit("Responds with 400, missing field", async () => {
      const req = {
        user: "mockUser",
        params: {},
      };
      await booksController.deleteBook(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Missing book id.");
    });

    xit("Responds with 500, the DB is not initialized", async () => {
      const req = {
        user: "mockUser",
        params: {},
      };
      const res = mockResponse();

      await booksController.deleteBook(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("An error occurred while getting this book");
    });
  });
});
