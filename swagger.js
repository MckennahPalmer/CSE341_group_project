const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Media Inventory App",
    description:
      "An app that will allow you to story different types of media and allow you to view your inventory.",
  },
  host: "",
  schemes: ["https", "http"],
};

const outputFile = "swagger-output.json";
const endpointsFiles = ["./server.js"];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc);
