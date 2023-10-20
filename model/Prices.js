const mongoose = require("mongoose");

const pricesSchema = new mongoose.Schema({
  quantity: {
    type: String,
  },
  flavourName: {
    type: String,
  },
  price: {
    type: Number,
  },
  priceId: {
    type: String,
  },
});

module.exports = mongoose.model("prices", pricesSchema);
