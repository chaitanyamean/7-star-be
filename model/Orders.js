const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: null,
  },
  mobile: {
    type: Number,
    unique: true,
  },
  image: {
    type: String,
  },
  flavourType: {
    type: String,
  },
  quantity: {
    type: String,
  },
  location: {
    type: String,
  },
  date: {
    type: String,
  },
  comments: {
    type: String,
  },
  address: {
    type: String,
  },
  orderId: {
    type: String,
  },
});

module.exports = mongoose.model("orders", userSchema);
