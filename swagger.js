const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Media Catalog",
    description:
      "Accesses a database for each user to their inventory of media",
  },
  host: "localhost:8080",
  schemes: ["http"],
};

const outputFile = "swagger-output.json";
const endpointsFiles = ["./server.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
