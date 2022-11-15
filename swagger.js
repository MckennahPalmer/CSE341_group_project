const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Pun API",
    description:
      "It access a database full of jokes, puns, and one liners using this API with its written GET and POST routes.",
  },
  host: "localhost:8080",
  schemes: ["http"],
};

const outputFile = "swagger-output.json";
const endpointsFiles = ["./server.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
