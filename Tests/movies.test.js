const moviesController = require("../controllers/movies");
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
describe("getAllMovies()", () => {
  describe("When no user is logged in", () => {
    beforeEach(() => {
      req.user = undefined;
    });

    it("Responds with a 401, 'Authentication failed.'", async () => {
      await moviesController.getAllMovies(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith("Authentication failed.");
    });
  });

  describe("Retrieve a movie by the Id", () => {
    it("Responds with the json file of the movie", async () => {
      const req = {
        user: "mockUser",
        params: { id: "637ee05926a634d0f54729f8" },
      };

      const movieOne = [
        {
          "title": "Raiders of the Lost Ark",
          "rating": "PG",
          "yearReleased": "06/12/1981",
          "duration": "1h 34m",
          "format": "DVD"
        }
      ];

      mongodb.getCollection = jest.fn(() => ({
        find: jest.fn(() => ({
          toArray: () => Promise.resolve(movieOne), // setting the result of the query to the contents of movieOne
        })),
      }));

      await moviesController.getMovieById(req, res);
      expect(res.setHeader).toHaveBeenCalledWith(
        "Content-Type",
        "application/json"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(movieOne[0]);
    });

    it("Responds with 401, 'Authentication failed.'", async () => {
      await moviesController.getMovieById(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send.mock.calls.length).toBe(1);
      expect(res.send).toHaveBeenCalledWith("Authentication failed.");
    });

    it("Responds with 400, missing movie id", async () => {
      const req = {
        user: "mockUser",
        params: {},
      };
      await moviesController.getMovieById(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Missing movie id.");
    });

    it("Responds with 400, No movie returned for that id", async () => {
      const req = {
        user: "mockUser",
        params: { id: "637ee05926a634d0f54729f8" },
      };

      mongodb.getCollection = jest.fn(() => ({
        find: jest.fn(() => undefined), // setting the result of the query to undefined
      }));

      await moviesController.getMovieById(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("No movie returned for that id.");
    });

    it("Responds with 500, the DB is not initialized", async () => {
      const req = {
        user: "mockUser",
        params: { id: "637ee05926a634d0f54729f8" },
      };
      const res = mockResponse();

      await moviesController.getMovieById(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        "An error occurred while getting this movie"
      );
    });
  });

  describe("Add new movie", () => {

    it("Adds movie and return successful code", async () => {
      const movieTest = [
        {
          "title": "Harry Potter and the Deathly Hallows part 1",
          "rating": "PG-13",
          "yearReleased": "2010",
          "duration": "2h 26m",
          "format": "DVD"
        }
      ]; 

      const req = {
        user: "mockUser",
        body: movieTest[0]
      };

      mongodb.getCollection = jest.fn(() => ({
        insertOne: jest.fn(() => ({
          acknowledged: true,
          toArray: () => Promise.resolve(movieTest), // setting the result of the query to the contents of movieOne
        })),
      }));

      await moviesController.addMovie(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(movieTest[0]);
    });
      
    it("Responds with 401, 'Authentication failed.'", async () => {
      await moviesController.addMovie(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send.mock.calls.length).toBe(1);
      expect(res.send).toHaveBeenCalledWith("Authentication failed.");
    });

    it("Responds with 400, missing body", async () => {
      const req = {
        user: "mockUser"
      };
      
      await moviesController.addMovie(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Invalid request, please provide a movie to add in the body.");
    });

    it("Responds with 400, missing field", async () => {
      const movieTest = [
        {
          "rating": "PG-13",
          "yearReleased": "2010",
          "duration": "2h 26m",
          "format": "DVD"
        }
      ]; 

      const req = {
        user: "mockUser",
        body: movieTest[0]
      };
      
      await moviesController.addMovie(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Missing field error: title");
    });

    it("Fails to add to movie to DB", async () => {
      const movieTest = [
        {
          "title": "Harry Potter and the Deathly Hallows part 1",
          "rating": "PG-13",
          "yearReleased": "2010",
          "duration": "2h 26m",
          "format": "DVD"
        }
      ]; 

      const req = {
        user: "mockUser",
        body: movieTest[0]
      };

      mongodb.getCollection = jest.fn(() => ({
        insertOne: jest.fn(() => ({
          acknowledged: false,
          toArray: () => Promise.resolve(movieTest), // setting the result of the query to the contents of movieOne
        })),
      }));

      await moviesController.addMovie(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(
        "Unknown error adding movie."
      );
    });

    it("Responds with 500, the DB is not initialized", async () => {
      const movieTest = [
        {
          "title": "Harry Potter and the Deathly Hallows part 1",
          "rating": "PG-13",
          "yearReleased": "2010",
          "duration": "2h 26m",
          "format": "DVD"
        }
      ]; 
      const req = {
        user: "mockUser",
        body: movieTest[0],
      };
      const res = mockResponse();

      await moviesController.addMovie(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        "An error occurred while getting this movie"
      );
    });
  });

  describe("Update the movie", () => {
    it("changes some info and saves it", async () => {
      const movieTest = [
        {
          "title": "Colton Kramer and the Deathly Finals part 1",
          "rating": "PG-13",
          "yearReleased": "2010",
          "duration": "2h 26m",
          "format": "In-person"
        }
      ];
  
      const req = {
        user: "mockUser",
        params: {id: "637ee05926a634d0f54729f8"},
        body: movieTest[0]
      };
  
      mongodb.getCollection = jest.fn(() => ({
        replaceOne: jest.fn(() => ({
          acknowledged: true,
          toArray: () => Promise.resolve(movieTest),
        })),
      }));

      await moviesController.updateMovie(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(movieTest[0]);
    });

    it("Responds with 401, 'Authentication failed.'", async () => {
      await moviesController.updateMovie(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send.mock.calls.length).toBe(1);
      expect(res.send).toHaveBeenCalledWith("Authentication failed.");
    });

    it("Responds with 400, missing parameter movie id", async () => {
      const req = {
        user: "mockUser",
        params: {},
      };
      await moviesController.updateMovie(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Missing param movie id.");
    });

    it("Responds with 400, missing body", async () => {
      const req = {
        user: "mockUser",
        params: {id: "637ee05926a634d0f54729f8"},
      };
      await moviesController.updateMovie(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Invalid request, please provide a body.");
    });

    it("Responds with 400, missing fields", async () => {
      const req = {
        user: "mockUser",
        params: {id: "637ee05926a634d0f54729f8"},
        body: {}
      };
      await moviesController.updateMovie(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Missing field error: title,rating,yearReleased,duration,format");
    });

    it("Fails to add to field to Movie", async () => {
      const movieTest = [
        {
          "title": "Colton Kramer and the Deathly Finals part 1",
          "rating": "PG-13",
          "yearReleased": "2010",
          "duration": "2h 26m",
          "format": "In-person"
        }
      ];
  
      const req = {
        user: "mockUser",
        params: {id: "637ee05926a634d0f54729f8"},
        body: movieTest[0]
      };
  
      mongodb.getCollection = jest.fn(() => ({
        replaceOne: jest.fn(() => ({
          acknowledged: false,
          toArray: () => Promise.resolve(movieTest),
        })),
      }));

      await moviesController.updateMovie(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(
        "Unknown error updating movie."
      );
    });

    it("Responds with 500, the DB is not initialized", async () => {
      const movieTest = [
        {
          "title": "Colton Kramer and the Deathly Finals part 1",
          "rating": "PG-13",
          "yearReleased": "2010",
          "duration": "2h 26m",
          "format": "In-person"
        }
      ];
      const req = {
        user: "mockUser",
        params: {id: "637ee05926a634d0f54729f8"},
        body: movieTest[0]
      };
      const res = mockResponse();

      await moviesController.updateMovie(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("An error occurred while getting this movie");
    });
  });

  describe("Deletes the movie", () => {
    it("Removes the movie we added earler from the database", async () => {

      const req = {
        user: "mockUser",
        params: {id: "637ee05926a634d0f54729f8"},
        // body: movieTest[0]
      };

      mongodb.getCollection = jest.fn(() => ({
        deleteOne: jest.fn(() => ({
          acknowledged: true,
          toArray: () => Promise.resolve(movieTest),
        })),
      }));

      await moviesController.deleteMovie(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it("Responds with 401, 'Authentication failed.'", async () => {
      await moviesController.deleteMovie(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send.mock.calls.length).toBe(1);
      expect(res.send).toHaveBeenCalledWith("Authentication failed.");
    });

    it("Responds with 400, Delete fails", async () => {
      const req = {
        user: "mockUser",
        params: {id: "637ee05926a634d0f54729f8"},
        // body: movieTest[0]
      };

      mongodb.getCollection = jest.fn(() => ({
        deleteOne: jest.fn(() => ({
          acknowledged: false,
          toArray: () => Promise.resolve(movieTest),
        })),
      }));

      await moviesController.deleteMovie(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Unknown error deleting movie.");
    });

    it("Responds with 500, the DB is not initialized", async () => {
      const movieTest = [
        {
          title: "The Fellowship of the Ring",
          author: "McKennah Palmer",
          yearPublished: "1954",
          format: "AudioMovie",
        },
      ];
      const req = {
        user: "mockUser",
        params: {id: "637ee05926a634d0f54729f8"},
        body: movieTest[0]
      };

      const res = mockResponse();

      await moviesController.deleteMovie(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("An error occurred while deleting this movie");
    });
  });
});