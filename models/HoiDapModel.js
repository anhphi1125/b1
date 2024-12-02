const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const hoidap = new Schema({
    id: {type: ObjectId},
    cauhoi: {type: String},
    traloi: {type: String},
    loai: {type: String},
    luu: {type: Boolean, default: false}
});
module.exports = mongoose.models.hoidap || mongoose.model("hoidap", hoidap);
