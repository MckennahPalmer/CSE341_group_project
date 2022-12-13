const moviesRouter = require("../movies");
const routesFor = require("../routesFor");

const routes = routesFor(moviesRouter);

describe("routes", () => {
  describe("/", () => {
    it("supports http GET", () => {
      expect(routes["/"]).toContain("get");
    });

    it("supports http POST", () => {
      expect(routes["/"]).toContain("post");
    });
  });

  describe("/:id", () => {
    it("supports http GET", () => {
      expect(routes["/:id"]).toContain("get");
    });

    it("supports http PUT", () => {
      expect(routes["/:id"]).toContain("put");
    });

    it("supports http DELETE", () => {
      expect(routes["/:id"]).toContain("delete");
    });
  });
});
