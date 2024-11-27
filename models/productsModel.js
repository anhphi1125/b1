//bắt buộc
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const product = new Schema({
  id: {type: ObjectId},
  productName: { type: String },
  productPrice: { type: Number },
  productQuantity: { type: Number },
});
module.exports = mongoose.models.product || mongoose.model("product", product);