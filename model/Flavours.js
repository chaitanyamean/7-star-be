const mongoose = require("mongoose");

const flavourSchema = new mongoose.Schema({
  flavourName: {
    type: String,
  },
  flavourId: {
    type: String,
  },
  image: {
    type: String,
  },
});

module.exports = mongoose.model("flavours", flavourSchema);
