const gamesController = require("../controllers/games");
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
describe("getAllGames()", () => {
  describe("When no user is logged in", () => {
    beforeEach(() => {
      req.user = undefined;
    });

    it("Responds with a 401, 'Authentication failed.'", async () => {
      await gamesController.getAllGames(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith("Authentication failed.");
    });
  });

  describe("Retrieve a game by the Id", () => {
    it("Responds with the json file of the game", async () => {
      const req = {
        user: "mockUser",
        params: { id: "637ee05926a634d0f54729f8" },
      };

      const gameOne = [
        {
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          yearPublished: "1960",
          format: "Paperback",
        },
      ];

      mongodb.getCollection = jest.fn(() => ({
        find: jest.fn(() => ({
          toArray: () => Promise.resolve(gameOne), // setting the result of the query to the contents of gameOne
        })),
      }));

      await gamesController.getGameById(req, res);
      expect(res.setHeader).toHaveBeenCalledWith(
        "Content-Type",
        "application/json"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(gameOne[0]);
    });

    it("Responds with 401, 'Authentication failed.'", async () => {
      await gamesController.getGameById(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send.mock.calls.length).toBe(1);
      expect(res.send).toHaveBeenCalledWith("Authentication failed.");
    });

    it("Responds with 400, missing game id", async () => {
      const req = {
        user: "mockUser",
        params: {},
      };
      await gamesController.getGameById(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Missing game id.");
    });

    it("Responds with 400, No game returned for that id", async () => {
      const req = {
        user: "mockUser",
        params: { id: "637ee05926a634d0f54729f8" },
      };

      mongodb.getCollection = jest.fn(() => ({
        find: jest.fn(() => undefined), // setting the result of the query to undefined
      }));

      await gamesController.getGameById(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("No game returned for that id.");
    });

    it("Responds with 500, the DB is not initialized", async () => {
      const req = {
        user: "mockUser",
        params: { id: "637ee05926a634d0f54729f8" },
      };
      const res = mockResponse();

      await gamesController.getGameById(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        "An error occurred while getting this game"
      );
    });
  });

  describe("Add new game", () => {

    it("Adds game and return successful code", async () => {
      const gameTest = [
        {
          title: "The Fellowship of the Ring",
          author: "J. R. R. Tolkien",
          yearPublished: "1954",
          format: "Paperback",
        },
      ]; 

      const req = {
        user: "mockUser",
        body: gameTest[0]
      };

      mongodb.getCollection = jest.fn(() => ({
        insertOne: jest.fn(() => ({
          acknowledged: true,
          toArray: () => Promise.resolve(gameTest), // setting the result of the query to the contents of gameOne
        })),
      }));

      await gamesController.addGame(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(gameTest[0]);
    });
      
    it("Responds with 401, 'Authentication failed.'", async () => {
      await gamesController.addGame(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send.mock.calls.length).toBe(1);
      expect(res.send).toHaveBeenCalledWith("Authentication failed.");
    });

    it("Responds with 400, missing body", async () => {
      const req = {
        user: "mockUser"
      };
      
      await gamesController.addGame(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Invalid request, please provide a game to add in the body.");
    });

    it("Responds with 400, missing field", async () => {
      const gameTest = [
        {
          author: "J. R. R. Tolkien",
          yearPublished: "1954",
          format: "Paperback",
        },
      ]; 

      const req = {
        user: "mockUser",
        body: gameTest[0]
      };
      
      await gamesController.addGame(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Missing field error: title");
    });

    it("Fails to add to game to DB", async () => {
      const gameTest = [
        {
          title: "The Fellowship of the Ring",
          author: "J. R. R. Tolkien",
          yearPublished: "1954",
          format: "Paperback",
        },
      ]; 

      const req = {
        user: "mockUser",
        body: gameTest[0]
      };

      mongodb.getCollection = jest.fn(() => ({
        insertOne: jest.fn(() => ({
          acknowledged: false,
          toArray: () => Promise.resolve(gameTest), // setting the result of the query to the contents of gameOne
        })),
      }));

      await gamesController.addGame(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(
        "Unknown error adding game."
      );
    });

    it("Responds with 500, the DB is not initialized", async () => {
      const gameTest = [
        {
          title: "The Fellowship of the Ring",
          author: "J. R. R. Tolkien",
          yearPublished: "1954",
          format: "Paperback",
        },
      ]; 
      const req = {
        user: "mockUser",
        body: gameTest[0],
      };
      const res = mockResponse();

      await gamesController.addGame(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        "An error occurred while getting this game"
      );
    });
  });

  describe("Update the game", () => {
    it("changes some info and saves it", async () => {
      const gameTest = [
        {
          title: "The Fellowship of the Ring",
          author: "McKennah Palmer",
          yearPublished: "1954",
          format: "AudioGame",
        },
      ];
  
      const req = {
        user: "mockUser",
        params: {id: "637ee05926a634d0f54729f8"},
        body: gameTest[0]
      };
  
      mongodb.getCollection = jest.fn(() => ({
        replaceOne: jest.fn(() => ({
          acknowledged: true,
          toArray: () => Promise.resolve(gameTest),
        })),
      }));

      await gamesController.updateGame(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(gameTest[0]);
    });

    it("Responds with 401, 'Authentication failed.'", async () => {
      await gamesController.updateGame(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send.mock.calls.length).toBe(1);
      expect(res.send).toHaveBeenCalledWith("Authentication failed.");
    });

    it("Responds with 400, missing parameter game id", async () => {
      const req = {
        user: "mockUser",
        params: {},
      };
      await gamesController.updateGame(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Missing param game id.");
    });

    it("Responds with 400, missing body", async () => {
      const req = {
        user: "mockUser",
        params: {id: "637ee05926a634d0f54729f8"},
      };
      await gamesController.updateGame(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Invalid request, please provide a body.");
    });

    it("Responds with 400, missing fields", async () => {
      const req = {
        user: "mockUser",
        params: {id: "637ee05926a634d0f54729f8"},
        body: {}
      };
      await gamesController.updateGame(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Missing field error: title,author,yearPublished,format");
    });

    it("Fails to add to field to Game", async () => {
      const gameTest = [
        {
          title: "The Fellowship of the Ring",
          author: "McKennah Palmer",
          yearPublished: "1954",
          format: "AudioGame",
        },
      ];
  
      const req = {
        user: "mockUser",
        params: {id: "637ee05926a634d0f54729f8"},
        body: gameTest[0]
      };
  
      mongodb.getCollection = jest.fn(() => ({
        replaceOne: jest.fn(() => ({
          acknowledged: false,
          toArray: () => Promise.resolve(gameTest),
        })),
      }));

      await gamesController.updateGame(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(
        "Unknown error updating game."
      );
    });

    it("Responds with 500, the DB is not initialized", async () => {
      const gameTest = [
        {
          title: "The Fellowship of the Ring",
          author: "McKennah Palmer",
          yearPublished: "1954",
          format: "AudioGame",
        },
      ];
      const req = {
        user: "mockUser",
        params: {id: "637ee05926a634d0f54729f8"},
        body: gameTest[0]
      };
      const res = mockResponse();

      await gamesController.updateGame(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("An error occurred while getting this game");
    });
  });

  describe("Deletes the game", () => {
    it("Removes the game we added earler from the database", async () => {
      // const gameTest = [
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
        // body: gameTest[0]
      };

      mongodb.getCollection = jest.fn(() => ({
        deleteOne: jest.fn(() => ({
          acknowledged: true,
          toArray: () => Promise.resolve(gameTest),
        })),
      }));

      await gamesController.deleteGame(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it("Responds with 401, 'Authentication failed.'", async () => {
      await gamesController.deleteGame(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send.mock.calls.length).toBe(1);
      expect(res.send).toHaveBeenCalledWith("Authentication failed.");
    });

    it("Responds with 400, Delete fails", async () => {
      const req = {
        user: "mockUser",
        params: {id: "637ee05926a634d0f54729f8"},
        // body: gameTest[0]
      };

      mongodb.getCollection = jest.fn(() => ({
        deleteOne: jest.fn(() => ({
          acknowledged: false,
          toArray: () => Promise.resolve(gameTest),
        })),
      }));

      await gamesController.deleteGame(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Unknown error deleting game.");
    });

    it("Responds with 500, the DB is not initialized", async () => {
      const gameTest = [
        {
          title: "The Fellowship of the Ring",
          author: "McKennah Palmer",
          yearPublished: "1954",
          format: "AudioGame",
        },
      ];
      const req = {
        user: "mockUser",
        params: {id: "637ee05926a634d0f54729f8"},
        body: gameTest[0]
      };

      const res = mockResponse();

      await gamesController.deleteGame(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("An error occurred while deleting this Game");
    });
  });
});
