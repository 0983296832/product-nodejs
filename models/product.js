const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  msp: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "CommnetDB" }],
});
const Productdb = mongoose.model("ProductDB", productSchema);

module.exports =Productdb ;
// mutiple export
// module.exports ={Productdb, post} ;
