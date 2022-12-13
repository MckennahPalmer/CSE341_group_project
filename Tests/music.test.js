const musicController = require("../controllers/music");
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
describe("getAllMusic()", () => {
  describe("When no user is logged in", () => {
    beforeEach(() => {
      req.user = undefined;
    });

    it("Responds with a 401, 'Authentication failed.'", async () => {
      await musicController.getAllMusic(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith("Authentication failed.");
    });
  });

  describe("Retrieve a music by the Id", () => {
    it("Responds with the json file of the music", async () => {
      const req = {
        user: "mockUser",
        params: { id: "637ee05926a634d0f54729f8" },
      };

      const musicOne = [
        {
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          yearPublished: "1960",
          format: "Paperback",
        },
      ];

      mongodb.getCollection = jest.fn(() => ({
        find: jest.fn(() => ({
          toArray: () => Promise.resolve(musicOne), // setting the result of the query to the contents of musicOne
        })),
      }));

      await musicController.getMusicById(req, res);
      expect(res.setHeader).toHaveBeenCalledWith(
        "Content-Type",
        "application/json"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(musicOne[0]);
    });

    it("Responds with 401, 'Authentication failed.'", async () => {
      await musicController.getMusicById(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send.mock.calls.length).toBe(1);
      expect(res.send).toHaveBeenCalledWith("Authentication failed.");
    });

    it("Responds with 400, missing music id", async () => {
      const req = {
        user: "mockUser",
        params: {},
      };
      await musicController.getMusicById(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Missing music id.");
    });

    it("Responds with 400, No music returned for that id", async () => {
      const req = {
        user: "mockUser",
        params: { id: "637ee05926a634d0f54729f8" },
      };

      mongodb.getCollection = jest.fn(() => ({
        find: jest.fn(() => undefined), // setting the result of the query to undefined
      }));

      await musicController.getMusicById(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("No music returned for that id.");
    });

    it("Responds with 500, the DB is not initialized", async () => {
      const req = {
        user: "mockUser",
        params: { id: "637ee05926a634d0f54729f8" },
      };
      const res = mockResponse();

      await musicController.getMusicById(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        "An error occurred while getting this music"
      );
    });
  });

  describe("Add new music", () => {

    it("Adds music and return successful code", async () => {
      const musicTest = [
        {
          title: "The Fellowship of the Ring",
          author: "J. R. R. Tolkien",
          yearPublished: "1954",
          format: "Paperback",
        },
      ]; 

      const req = {
        user: "mockUser",
        body: musicTest[0]
      };

      mongodb.getCollection = jest.fn(() => ({
        insertOne: jest.fn(() => ({
          acknowledged: true,
          toArray: () => Promise.resolve(musicTest), // setting the result of the query to the contents of musicOne
        })),
      }));

      await musicController.addMusic(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(musicTest[0]);
    });
      
    it("Responds with 401, 'Authentication failed.'", async () => {
      await musicController.addMusic(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send.mock.calls.length).toBe(1);
      expect(res.send).toHaveBeenCalledWith("Authentication failed.");
    });

    it("Responds with 400, missing body", async () => {
      const req = {
        user: "mockUser"
      };
      
      await musicController.addMusic(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Invalid request, please provide a music to add in the body.");
    });

    it("Responds with 400, missing field", async () => {
      const musicTest = [
        {
          author: "J. R. R. Tolkien",
          yearPublished: "1954",
          format: "Paperback",
        },
      ]; 

      const req = {
        user: "mockUser",
        body: musicTest[0]
      };
      
      await musicController.addMusic(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Missing field error: title");
    });

    it("Fails to add to music to DB", async () => {
      const musicTest = [
        {
          title: "The Fellowship of the Ring",
          author: "J. R. R. Tolkien",
          yearPublished: "1954",
          format: "Paperback",
        },
      ]; 

      const req = {
        user: "mockUser",
        body: musicTest[0]
      };

      mongodb.getCollection = jest.fn(() => ({
        insertOne: jest.fn(() => ({
          acknowledged: false,
          toArray: () => Promise.resolve(musicTest), // setting the result of the query to the contents of musicOne
        })),
      }));

      await musicController.addMusic(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(
        "Unknown error adding music."
      );
    });

    it("Responds with 500, the DB is not initialized", async () => {
      const musicTest = [
        {
          title: "The Fellowship of the Ring",
          author: "J. R. R. Tolkien",
          yearPublished: "1954",
          format: "Paperback",
        },
      ]; 
      const req = {
        user: "mockUser",
        body: musicTest[0],
      };
      const res = mockResponse();

      await musicController.addMusic(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        "An error occurred while getting this music"
      );
    });
  });

  describe("Update the music", () => {
    it("changes some info and saves it", async () => {
      const musicTest = [
        {
          title: "The Fellowship of the Ring",
          author: "McKennah Palmer",
          yearPublished: "1954",
          format: "AudioMusic",
        },
      ];
  
      const req = {
        user: "mockUser",
        params: {id: "637ee05926a634d0f54729f8"},
        body: musicTest[0]
      };
  
      mongodb.getCollection = jest.fn(() => ({
        replaceOne: jest.fn(() => ({
          acknowledged: true,
          toArray: () => Promise.resolve(musicTest),
        })),
      }));

      await musicController.updateMusic(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(musicTest[0]);
    });

    it("Responds with 401, 'Authentication failed.'", async () => {
      await musicController.updateMusic(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send.mock.calls.length).toBe(1);
      expect(res.send).toHaveBeenCalledWith("Authentication failed.");
    });

    it("Responds with 400, missing parameter music id", async () => {
      const req = {
        user: "mockUser",
        params: {},
      };
      await musicController.updateMusic(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Missing param music id.");
    });

    it("Responds with 400, missing body", async () => {
      const req = {
        user: "mockUser",
        params: {id: "637ee05926a634d0f54729f8"},
      };
      await musicController.updateMusic(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Invalid request, please provide a body.");
    });

    it("Responds with 400, missing fields", async () => {
      const req = {
        user: "mockUser",
        params: {id: "637ee05926a634d0f54729f8"},
        body: {}
      };
      await musicController.updateMusic(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Missing field error: title,author,yearPublished,format");
    });

    it("Fails to add to field to Music", async () => {
      const musicTest = [
        {
          title: "The Fellowship of the Ring",
          author: "McKennah Palmer",
          yearPublished: "1954",
          format: "AudioMusic",
        },
      ];
  
      const req = {
        user: "mockUser",
        params: {id: "637ee05926a634d0f54729f8"},
        body: musicTest[0]
      };
  
      mongodb.getCollection = jest.fn(() => ({
        replaceOne: jest.fn(() => ({
          acknowledged: false,
          toArray: () => Promise.resolve(musicTest),
        })),
      }));

      await musicController.updateMusic(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(
        "Unknown error updating music."
      );
    });

    it("Responds with 500, the DB is not initialized", async () => {
      const musicTest = [
        {
          title: "The Fellowship of the Ring",
          author: "McKennah Palmer",
          yearPublished: "1954",
          format: "AudioMusic",
        },
      ];
      const req = {
        user: "mockUser",
        params: {id: "637ee05926a634d0f54729f8"},
        body: musicTest[0]
      };
      const res = mockResponse();

      await musicController.updateMusic(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("An error occurred while getting this music");
    });
  });

  describe("Deletes the music", () => {
    it("Removes the music we added earler from the database", async () => {
      // const musicTest = [
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
        // body: musicTest[0]
      };

      mongodb.getCollection = jest.fn(() => ({
        deleteOne: jest.fn(() => ({
          acknowledged: true,
          toArray: () => Promise.resolve(musicTest),
        })),
      }));

      await musicController.deleteMusic(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it("Responds with 401, 'Authentication failed.'", async () => {
      await musicController.deleteMusic(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send.mock.calls.length).toBe(1);
      expect(res.send).toHaveBeenCalledWith("Authentication failed.");
    });

    it("Responds with 400, Delete fails", async () => {
      const req = {
        user: "mockUser",
        params: {id: "637ee05926a634d0f54729f8"},
        // body: musicTest[0]
      };

      mongodb.getCollection = jest.fn(() => ({
        deleteOne: jest.fn(() => ({
          acknowledged: false,
          toArray: () => Promise.resolve(musicTest),
        })),
      }));

      await musicController.deleteMusic(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Unknown error deleting music.");
    });

    it("Responds with 500, the DB is not initialized", async () => {
      const musicTest = [
        {
          title: "The Fellowship of the Ring",
          author: "McKennah Palmer",
          yearPublished: "1954",
          format: "AudioMusic",
        },
      ];
      const req = {
        user: "mockUser",
        params: {id: "637ee05926a634d0f54729f8"},
        body: musicTest[0]
      };

      const res = mockResponse();

      await musicController.deleteMusic(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("An error occurred while deleting this music");
    });
  });
});