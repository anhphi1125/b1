const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const sinhvien = new Schema({
    id: { type: ObjectId },
    mssv: { type: Number },
    hoten: { type: String },
    diemTB: { type: Number },
    boMon: { type: String },
    tuoi: { type: Number },
});

module.exports = mongoose.models.sinhvien || mongoose.model("sinhvien", sinhvien);