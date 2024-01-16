const mongoose = require("mongoose");

const questionsSchema = new mongoose.Schema({
  problemName: {
    type: String,
  },
  questionId: {
    type: String,
  },
  code: {
    type: String,
  },
  type: {
    type: String,
  },
});

module.exports = mongoose.model("questions", questionsSchema);
