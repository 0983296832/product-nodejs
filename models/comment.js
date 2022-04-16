const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
  author: String,
  comment: String,
});

const Commentdb = mongoose.model("CommnetDB", commentSchema);
module.exports = Commentdb;
