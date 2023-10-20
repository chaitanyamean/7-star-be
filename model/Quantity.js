const mongoose = require("mongoose");

const quantitySchema = new mongoose.Schema({
  quantityName: {
    type: String,
  },
  quantityId: {
    type: String,
  },
});

module.exports = mongoose.model("quantity", quantitySchema);
