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
      const bookTest = [
        {
          title: "The Fellowship of the Ring",
          author: "J. R. R. Tolkien",
          yearPublished: "1954",
          format: "Paperback",
        },
      ]; 

      const req = {
        user: "mockUser",
        body: bookTest[0]
      };

      mongodb.getCollection = jest.fn(() => ({
        insertOne: jest.fn(() => ({
          acknowledged: true,
          toArray: () => Promise.resolve(bookTest), // setting the result of the query to the contents of bookOne
        })),
      }));

      await booksController.addBook(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(bookTest[0]);
    });
      
    it("Responds with 401, 'Authentication failed.'", async () => {
      await booksController.addBook(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send.mock.calls.length).toBe(1);
      expect(res.send).toHaveBeenCalledWith("Authentication failed.");
    });

    it("Responds with 400, missing body", async () => {
      const req = {
        user: "mockUser"
      };
      
      await booksController.addBook(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Invalid request, please provide a book to add in the body.");
    });

    it("Responds with 400, missing field", async () => {
      const bookTest = [
        {
          author: "J. R. R. Tolkien",
          yearPublished: "1954",
          format: "Paperback",
        },
      ]; 

      const req = {
        user: "mockUser",
        body: bookTest[0]
      };
      
      await booksController.addBook(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Missing field error: title");
    });

    it("Fails to add to book to DB", async () => {
      const bookTest = [
        {
          title: "The Fellowship of the Ring",
          author: "J. R. R. Tolkien",
          yearPublished: "1954",
          format: "Paperback",
        },
      ]; 

      const req = {
        user: "mockUser",
        body: bookTest[0]
      };

      mongodb.getCollection = jest.fn(() => ({
        insertOne: jest.fn(() => ({
          acknowledged: false,
          toArray: () => Promise.resolve(bookTest), // setting the result of the query to the contents of bookOne
        })),
      }));

      await booksController.addBook(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(
        "Unknown error adding book."
      );
    });

    it("Responds with 500, the DB is not initialized", async () => {
      const bookTest = [
        {
          title: "The Fellowship of the Ring",
          author: "J. R. R. Tolkien",
          yearPublished: "1954",
          format: "Paperback",
        },
      ]; 
      const req = {
        user: "mockUser",
        body: bookTest[0],
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
    it("changes some info and saves it", async () => {
      const bookTest = [
        {
          title: "The Fellowship of the Ring",
          author: "McKennah Palmer",
          yearPublished: "1954",
          format: "AudioBook",
        },
      ];
  
      const req = {
        user: "mockUser",
        params: {id: "637ee05926a634d0f54729f8"},
        body: bookTest[0]
      };
  
      mongodb.getCollection = jest.fn(() => ({
        replaceOne: jest.fn(() => ({
          acknowledged: true,
          toArray: () => Promise.resolve(bookTest),
        })),
      }));

      await booksController.updateBook(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(bookTest[0]);
    });

    it("Responds with 401, 'Authentication failed.'", async () => {
      await booksController.updateBook(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send.mock.calls.length).toBe(1);
      expect(res.send).toHaveBeenCalledWith("Authentication failed.");
    });

    it("Responds with 400, missing parameter book id", async () => {
      const req = {
        user: "mockUser",
        params: {},
      };
      await booksController.updateBook(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Missing param book id.");
    });

    it("Responds with 400, missing body", async () => {
      const req = {
        user: "mockUser",
        params: {id: "637ee05926a634d0f54729f8"},
      };
      await booksController.updateBook(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Invalid request, please provide a body.");
    });

    it("Responds with 400, missing fields", async () => {
      const req = {
        user: "mockUser",
        params: {id: "637ee05926a634d0f54729f8"},
        body: {}
      };
      await booksController.updateBook(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Missing field error: title,author,yearPublished,format");
    });

    it("Fails to add to field to Book", async () => {
      const bookTest = [
        {
          title: "The Fellowship of the Ring",
          author: "McKennah Palmer",
          yearPublished: "1954",
          format: "AudioBook",
        },
      ];
  
      const req = {
        user: "mockUser",
        params: {id: "637ee05926a634d0f54729f8"},
        body: bookTest[0]
      };
  
      mongodb.getCollection = jest.fn(() => ({
        replaceOne: jest.fn(() => ({
          acknowledged: false,
          toArray: () => Promise.resolve(bookTest),
        })),
      }));

      await booksController.updateBook(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(
        "Unknown error updating book."
      );
    });

    it("Responds with 500, the DB is not initialized", async () => {
      const bookTest = [
        {
          title: "The Fellowship of the Ring",
          author: "McKennah Palmer",
          yearPublished: "1954",
          format: "AudioBook",
        },
      ];
      const req = {
        user: "mockUser",
        params: {id: "637ee05926a634d0f54729f8"},
        body: bookTest[0]
      };
      const res = mockResponse();

      await booksController.updateBook(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("An error occurred while getting this book");
    });
  });

  describe("Deletes the book", () => {
    it("Removes the book we added earler from the database", async () => {
      // const bookTest = [
      //   {
      //     title: "The Fellowship of the Ring",
      //     author: "J. R. R. Tolkien",
      //     yearPublished: "1954",
      //     format: "Paperback",
      //   },
      // ]; 

      const req = {
        user: "mockUser",
        params: {id: "637ee05926a634d0f54729f8"},
        // body: bookTest[0]
      };

      mongodb.getCollection = jest.fn(() => ({
        deleteOne: jest.fn(() => ({
          acknowledged: true,
          toArray: () => Promise.resolve(bookTest),
        })),
      }));

      await booksController.deleteBook(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith();
    });

    it("Responds with 401, 'Authentication failed.'", async () => {
      await booksController.deleteBook(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send.mock.calls.length).toBe(1);
      expect(res.send).toHaveBeenCalledWith("Authentication failed.");
    });

    it("Responds with 400, Delete fails", async () => {
      const req = {
        user: "mockUser",
        params: {id: "637ee05926a634d0f54729f8"},
        // body: bookTest[0]
      };

      mongodb.getCollection = jest.fn(() => ({
        deleteOne: jest.fn(() => ({
          acknowledged: false,
          toArray: () => Promise.resolve(bookTest),
        })),
      }));

      await booksController.deleteBook(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Unknown error deleting book.");
    });

    it("Responds with 500, the DB is not initialized", async () => {
      const bookTest = [
        {
          title: "The Fellowship of the Ring",
          author: "McKennah Palmer",
          yearPublished: "1954",
          format: "AudioBook",
        },
      ];
      const req = {
        user: "mockUser",
        params: {id: "637ee05926a634d0f54729f8"},
        body: bookTest[0]
      };

      const res = mockResponse();

      await booksController.deleteBook(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("An error occurred while deleting this book");
    });
  });
});
