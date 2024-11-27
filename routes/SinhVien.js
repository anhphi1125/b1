var express = require("express");
var router = express.Router();

var sinhvienModel = require("../models/SinhVienModel");
const JWT = require('jsonwebtoken');
const config = require("../ultil/tokenConfig");
const e = require("express");

// - Lấy toàn bộ danh sách sinh viên
//localhost:3000/sinhvien/all
router.get("/all", async function (req, res) {
    try {

        const token = req.header("Authorization").split(' ')[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err, id) {
                if (err) {
                    res.status(403).json({ status: false, message: "Đã có lỗi xảy ra" + err});
                } else {
                    //xử lý chức năng tương ứng với API
                    var list = await sinhvienModel.find();
                    res.status(200).json(list);
                }
            });
        } else {
            res.status(401).json({ status: false, message: "Không xác thực" + e});
        }
    } catch (error) {
        res.status(400).json({ status: false, message: 'Đã có lỗi xảy ra' });
    }
});
// - Lấy toàn bộ danh sách sinh viên thuộc khoa CNTT
//localhost:3000/sinhvien/getCNTT
router.get("/getCNTT", async function (req, res) {
    try {

        const token = req.header("Authorization").split(' ')[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err, id) {
                if (err) {
                    res.status(403).json({ status: false, message: "Đã có lỗi xảy ra" + err});
                } else {
                    //xử lý chức năng tương ứng với API
                    const { mon } = req.query;
                    var list = await sinhvienModel.find({ boMon: mon || 'CNTT' });
                    res.status(200).json(list);
                }
            });
        } else {
            res.status(401).json({ status: false, message: 'Không xác định' });
        }
    } catch (error) {
        res.status(400).json({ status: false, message: 'Đã có lỗi xảy ra' });
    }
});
// - Lấy danh sách sản phẩm có điểm trung bình từ 6.5 đến 8.5
//localhost:3000/sinhvien/getdiemTB
router.get("/getdiemTB", async function (req, res) {

    try {

        const token = req.header("Authorization").split(' ')[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err, id) {
                if (err) {
                    res.status(403).json({ status: false, message: "Đã có lỗi xảy ra" + err});
                } else {
                    //xử lý chức năng tương ứng với API
                    const { from, to } = req.query;

                    const minDiem = from ? parseFloat(from) : 6.5;
                    const maxDiem = to ? parseFloat(to) : 8.5;

                    var list = await sinhvienModel.find({ $and: [{ diemTB: { $gte: minDiem } }, { diemTB: { $lte: maxDiem } }] });
                    res.status(200).json(list);
                }
            });
        } else {
            res.status(401).json({ status: false, message: "Không xác thực" + e});
        }
    } catch (error) {
        res.status(400).json({ status: false, message: 'Đã có lỗi xảy ra' });
    }
});
// - Tìm kiếm thông tin của sinh viên theo MSSV
//localhost:3000/sinhvien/timMSSV
router.get("/timMSSV", async function (req, res) {
    try {

        const token = req.header("Authorization").split(' ')[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err, id) {
                if (err) {
                    res.status(403).json({ status: false, message: "Đã có lỗi xảy ra" + err});
                } else {
                    //xử lý chức năng tương ứng với API
                    const { mssv } = req.query;
                    const MSSV = parseInt(mssv);
                    var list = await sinhvienModel.find({ mssv: MSSV });
                    res.status(200).json(list);
                }
            });
        } else {
            res.status(401).json({ status: false, message: "Không xác thực" + e});
        }
    } catch (error) {
        res.status(400).json({ status: false, message: 'Đã có lỗi xảy ra' });
    }
});
// - Thêm mới một sinh viên mới
//localhost:3000/sinhvien/themSv
router.post("/themSv", async function (req, res) {
    try {

        const token = req.header("Authorization").split(' ')[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err, id) {
                if (err) {
                    res.status(403).json({ status: false, message: "Đã có lỗi xảy ra" + err});
                } else {
                    //xử lý chức năng tương ứng với API
                    const { mssv, hoten, diemTB, boMon, tuoi } = req.body;
                    const item = { mssv, hoten, diemTB, boMon, tuoi };
                    await sinhvienModel.create(item);
                    res.status(200).json({ status: true, message: 'Đã thêm thành công' });
                }
            });
        } else {
            res.status(401).json({ status: false, message: "Không xác thực" + e});
        }
    } catch (error) {
        res.status(400).json({ status: false, message: 'Đã có lỗi xảy ra' });
    }
});
// - Thay đổi thông tin sinh viên theo MSSV
router.put("/edit", async function (req, res) {
    try {
        const { id, mssv, hoten, diemTB, boMon, tuoi } = req.body;
        const find = await sinhvienModel.findById(id);

        if (find) {
            find.mssv = mssv ? mssv : find.mssv;
            find.hoten = hoten ? hoten : find.hoten;
            find.diemTB = diemTB ? diemTB : find.diemTB;
            find.boMon = boMon ? boMon : find.boMon;
            find.tuoi = tuoi ? tuoi : find.tuoi;
            await find.save();
            res.status(200).json({ status: true, message: 'Chỉnh sửa thành công' });
        }
    } catch (error) {
        res.status(400).json({ status: false, message: 'Đã có lỗi xảy ra' + error });
    }
});
// - Xóa một sinh viên ra khỏi danh sách
// localhost:3000/sinhvien/xoaSv
router.delete("/xoaSv", async function (req, res) {
    try {
        const { id } = req.query;
        const result = await sinhvienModel.findByIdAndDelete(id);
        if (result) {
            res.status(200).json({ status: true, message: 'Đã xóa thành công' });
        } else {
            res.status(404).json({ status: false, message: 'Không tìm thấy sinh viên' });
        }
    } catch (error) {
        res.status(400).json({ status: false, message: 'Đã có lỗi xảy ra' + error });
    }
});
// - Lấy danh sách các sinh viên thuộc BM CNTT và có DTB từ 9.0
// localhost:3000/sinhvien/getCNTT9
router.get("/getCNTT9", async function (req, res) {
    try {
        const list = await sinhvienModel.find({ boMon: 'CNTT', diemTB: { $gte: 9.0 } });
        res.status(200).json(list);
    } catch (error) {
        res.status(400).json({ status: false, message: 'Đã có lỗi xảy ra' + error });
    }
});
// - Lấy ra danh sách các sinh viên có độ tuổi từ 18 đến 20 thuộc CNTT có điểm trung bình từ 6.5
// localhost:3000/sinhvien/getTuoiDiem
router.get("/getTuoiDiem", async function (req, res) {
    try {
        const list = await sinhvienModel.find({
            boMon: 'CNTT',
            tuoi: { $gte: 18, $lte: 20 },
            diemTB: { $gte: 6.5 }
        });
        res.status(200).json(list);
    } catch (error) {
        res.status(400).json({ status: false, message: 'Đã có lỗi xảy ra' + error });
    }
});
// - Sắp xếp danh sách sinh viên tăng dần theo DTB
// localhost:3000/sinhvien/sapXepDiem
router.get("/sapXepDiem", async function (req, res) {
    try {
        const list = await sinhvienModel.find().sort({ diemTB: 1 }); // 1 là sắp xếp tăng dần
        res.status(200).json(list);
    } catch (error) {
        res.status(400).json({ status: false, message: 'Đã có lỗi xảy ra' + error });
    }
});
// - Tìm sinh viên có điểm trung bình cao nhất thuộc BM CNTT
// localhost:3000/sinhvien/dtbCaoNhat
router.get("/dtbCaoNhat", async function (req, res) {
    try {
        //Tìm điểm trung bình cao nhất
        const maxDiem = await sinhvienModel.find({ boMon: 'CNTT' }).sort({ diemTB: -1 }).limit(1);
        if (!maxDiem) {
            return res.status(404).json({ status: false, message: 'Không tìm thấy sinh viên nào thuộc BM CNTT' });
        }
        //Tìm tất cả sinh viên có điểm trung bình bằng với điểm cao nhất
        const students = await sinhvienModel.find({ boMon: 'CNTT', diemTB: maxDiem[0].diemTB });
        res.status(200).json(students);
    } catch (error) {
        res.status(400).json({ status: false, message: 'Đã có lỗi xảy ra: ' + error });
    }
});

router.post("/login", async function (req, res) {
    try {
        const { username, password } = req.body;
        const checkUser = await sinhvienModel.find({ mssv: username, hoten: password });
        if (checkUser == null) {
            res.status(200).json({ status: false, message: "Đăng nhập không thành công" });
        } else {
            const token = JWT.sign({ mssv: username }, config.SECRETKEY, { expiresIn: '30s' });
            const refreshToken = JWT.sign({ mssv: username }, config.SECRETKEY, { expiresIn: '1h' });
            res.status(200).json({ status: true, message: "Đăng nhập thành công", token: token, refreshToken: refreshToken });
        }
    } catch (error) {
        res.status(400).json({ status: false, message: "Đã xảy ra lỗi" })
    }
});

module.exports = router;