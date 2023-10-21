const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: null,
    },
    mobile: {
      type: Number,
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
      type: Date,
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
    price: {
      type: String,
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = mongoose.model("orders", userSchema);
