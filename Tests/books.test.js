const booksController = require("../controllers/books");
//const mockingoose = require("mockingoose");
// const books = require("../routes/books");
jest.mock("../db/connect");

let req, res, send;

beforeEach(() => {
  req = {};
  send = jest.fn();
  res = {
    status: jest.fn(() => ({
      send,
    })),
    json: jest.fn(),
    send,
  };
});
// This test works
describe("getAllBooks()", () => {
  describe("When no user is logged in", () => {
    beforeEach(() => {
      req.user = undefined;
    });

    it("Responds with a 401", () => {
      booksController.getAllBooks(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });
    it("Responds with 'Authentication failed.'", () => {
      booksController.getAllBooks(req, res);

      expect(send).toHaveBeenCalledWith("Authentication failed.");
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
  describe("Retrieve a book by the Id", () => {
    it("responds with the json file of the book", () => {
      // const Id = "637ee05926a634d0f54729f8";
      // const bookOne = [
      //   {
      //     title: "To Kill a Mockingbird",
      //     author: "Harper Lee",
      //     yearPublished: "1960",
      //     format: "Paperback",
      //   },
      // ];

      booksController.getBookById(req, res);

      expect(res.json).toHaveBeenCalledWith([
        {
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          yearPublished: "1960",
          format: "Paperback",
        },
      ]);
    });

    it("responds with a 401", () => {
      booksController.getBookById(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });
    
    it("Responds with 'Authentication failed.'", () => {
      booksController.getAllBooks(req, res);

      expect(send).toHaveBeenCalledWith("Authentication failed.");
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
