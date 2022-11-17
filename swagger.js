const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Media Catalog",
    description:
      "Accesses a database for each user to their inventory of media",
  },
  // host: "localhost:8080",
  host: "cse341-group-project.onrender.com",
  schemes: ["https"],
};

const outputFile = "swagger-output.json";
const endpointsFiles = ["./server.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
