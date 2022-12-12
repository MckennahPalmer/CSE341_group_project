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
  jest.resetAllMocks()
  req = {};   // No user defined in the request
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

  /************************************
   The following tests do not work yet.
   ************************************/

  // describe("When a user is logged in", () => {
  //   beforeEach(() => {
  //     req.user = "testuser";
  //   });

  //   describe("and a user has no books", () => {
  //     beforeEach(() => {
  //       // req.books = [];
  //       mockingoose(books).toReturn({ test: "foo" }, "find");
  //     });

  //     it("responds with a 200", () => {
  //       booksController.getAllBooks(req, res);

  //       expect(res.status).toHaveBeenCalledWith(200);
  //     });

  //     it("responds with an empty array", () => {
  //       booksController.getAllBooks(req, res);

  //       expect(res.json).toHaveBeenCalledWith([]);
  //     });
  //   });
  //   describe("When a user has books", () => {});
  // });
  // });
  
  describe('Retrieve a book by the Id', () => {
    
    it('Responds with the json file of the book', async () => {
      const req = {
        user: 'mockUser',
        params: { id: '637ee05926a634d0f54729f8' },
      };

      const bookOne = [
        {
          title: 'To Kill a Mockingbird',
          author: 'Harper Lee',
          yearPublished: '1960',
          format: 'Paperback',
        },
      ];

      mongodb.getCollection = jest.fn(() => ({
        find: jest.fn(() => ({
          toArray: () => Promise.resolve(bookOne),    // setting the result of the query to the contents of bookOne
        })),
      }));

      await booksController.getBookById(req, res);
      expect(res.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'application/json'
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(bookOne[0]);
    });

    it("Responds with 401, 'Authentication failed.'", async () => {
      await booksController.getBookById(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send.mock.calls.length).toBe(1)
      expect(res.send).toHaveBeenCalledWith('Authentication failed.');
    });

    it('Responds with 400, missing book id', async () => {
      const req = {
        user: 'mockUser',
        params: {}
      };
      await booksController.getBookById(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Missing book id.");
    });

    it('Responds with 400, No book returned for that id', async () => {
      const req = {
        user: 'mockUser',
        params: { id: '637ee05926a634d0f54729f8' },
      };

      mongodb.getCollection = jest.fn(() => ({
        find: jest.fn(() => undefined),   // setting the result of the query to undefined
      }));
      
      await booksController.getBookById(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("No book returned for that id.");
    });

    it('Responds with 500, the DB is not initialized', async () => {
      const req = {
        user: 'mockUser',
        params: { id: '637ee05926a634d0f54729f8' },
      };
      const res = mockResponse();
      
      await booksController.getBookById(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("An error occurred while getting this book");
    });

  });

  // describe("Add new book", () => {
  //   it("Adds book and return successful code", () => {
  //     booksController.addBook(req, res);

  //     expect(res.status).toHaveBeenCalledWith(200);
  //   });

  //   it("Responds with a 401", () => {
  //     booksController.addBook(req, res);

  //     expect(res.status).toHaveBeenCalledWith(401);
  //     expect(res.send).toHaveBeenCalledWith("Authorization failed.");
  //   });

  //   it("display the error message", () => {
  //     booksController.addBook(req, res);

  //     expect(res.status).toHaveBeenCalledWith(500);
  //     expect(res.send).toHaveBeenCalledWith(
  //       "An error occurred while adding a book."
  //     );
  //   });
  // });

  // describe("Update the book", () => {
  //   it("changes some info and saves it", () => {
  //     booksController.updateBook(req, res);

  //     expect(res.status).toHaveBeenCalledWith(200);
  //   });

  //   it("Responds with a 401", () => {
  //     booksController.updateBook(req, res);

  //     expect(res.status).toHaveBeenCalledWith(401);
  //     expect(res.send).toHaveBeenCalledWith("Authorization failed.");
  //   });

  //   it("display the error message", () => {
  //     booksController.updateBook(req, res);

  //     expect(res.status).toHaveBeenCalledWith(500);
  //     expect(res.send).toHaveBeenCalledWith(
  //       "An error occurred while update the book."
  //     );
  //   });
  // });

  // describe("Deletes the book", () => {
  //   it("Removes the book we added earler from the database", () => {
  //     booksController.deleteBook(req, res);

  //     expect(res.status).toHaveBeenCalledWith(200);
  //   });

  //   it("Responds with a 401", () => {
  //     booksController.deleteBook(req, res);

  //     expect(res.status).toHaveBeenCalledWith(401);
  //     expect(res.send).toHaveBeenCalledWith("Authorization failed.");
  //   });

  //   it("display the error message", () => {
  //     booksController.deleteBook(req, res);

  //     expect(res.status).toHaveBeenCalledWith(500);
  //     expect(res.send).toHaveBeenCalledWith(
  //       "An error occurred while trying to delete the book."
  //     );
  //   });
  // });
});
