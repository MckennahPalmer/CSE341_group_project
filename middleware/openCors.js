const cors = require("cors");

var corOptions = {
  options: "*",
};

module.exports = cors(corOptions);
