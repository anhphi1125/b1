var express = require("express");
var router = express.Router();

var hoidapModel = require("../models/HoiDapModel");


// 1.(Tạo mới câu hỏi)
router.post('/add', async (req, res) => {
    try {
        const { cauhoi, traloi, loai } = req.body;
        const newQuestion = new hoidapModel({ cauhoi, traloi, loai });
        await hoidapModel.create(newQuestion);
        res.status(200).json({ status: true, message: 'Thêm thành công' })
    } catch (err) {
        res.status(400).json({ status: false, message: 'có lỗi xảy ra' });
    }
});

// 2.(Lấy danh sách câu hỏi)
router.get('/dscauhoi', async (req, res) => {
    try {
        var list = await hoidapModel.find().select("_id cauhoi");
        res.status(200).json(list);
    } catch (error) {
        res.status(400).json({ status: false, message: 'Có lỗi xảy ra' });
    }
});

// 3.(Lấy chi tiết câu hỏi)
router.get('/questions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const question = await hoidapModel.findById(id);
        if (!question) {
            res.status(403).json({ status: false, message: 'Không tìm thấy !!!' });
        } else {
            res.status(200).json(question);
        }

    } catch (err) {
        res.status(400).json({ status: false, message: 'Có lỗi xảy ra' });
    }
});

// 4.(Cập nhật câu hỏi)
router.put('/edit', async (req, res) => {
    try {
        const { id, cauhoi, traloi, loai } = req.body;
        const updatedQuestion = await hoidapModel.findById(id);
        if (updatedQuestion) {
            updatedQuestion.cauhoi = cauhoi ? cauhoi : updatedQuestion.cauhoi;
            updatedQuestion.traloi = traloi ? traloi : updatedQuestion.traloi;
            updatedQuestion.loai = loai ? loai : updatedQuestion.loai;
            await updatedQuestion.save();
            res.status(200).json({ status: true, message: "Đã sửa thành công" });
        } else {
            res.status(404).json({ status: false, message: "Không tìm thấy sản phẩm" + updatedQuestion});
        }
    } catch (err) {
        res.status(400).json({ status: false, message: 'Có lỗi xảy ra' });
    }
});

// 5.(Xóa câu hỏi)
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedQuestion = await hoidapModel.findByIdAndDelete(id);
        if (!deletedQuestion) {
            res.status(403).json({ status: false, message: 'Không tìm thấy !!!' });
        }else{
            res.status(200).json({ status: true, message: "Đã xóa thành công" });
        }
    } catch (err) {
        res.status(400).json({ status: false, message: 'Có lỗi xảy ra' });
    }
});

// 6. (Tìm kiếm câu hỏi theo thể loại)
router.get('/searchCate', async (req, res) => {
    try {
        const { loai } = req.query;
        if (!loai) {
            return res.status(400).json({ status: false, message: 'Thể loại không được cung cấp' });
        }
        const questions = await hoidapModel.find({ loai: loai });
        if (questions.length === 0) {
            return res.status(404).json({ status: false, message: 'Không tìm thấy câu hỏi nào với thể loại này' });
        }
        res.status(200).json(questions);
    } catch (err) {
        res.status(500).json({ status: false, message: 'Có lỗi xảy ra: ' + err.message });
    }
});

// 7 (tìm kiếm câu hỏi theo câu hỏi)
router.get('/searchCauhoi', async (req, res) => {
    try {
        const { cauhoi } = req.query;
        if (!cauhoi) {
            return res.status(400).json({ status: false, message: 'Câu hỏi không được cung cấp' });
        }
        const questions = await hoidapModel.find({ cauhoi: cauhoi });
        if (questions.length === 0) {
            return res.status(404).json({ status: false, message: 'Không tìm thấy câu hỏi nào !!!' });
        }
        res.status(200).json(questions);
    } catch (err) {
        res.status(500).json({ status: false, message: 'Có lỗi xảy ra: ' + err.message });
    }
});

// 8.(Thống kê số lượng câu hỏi theo thể loại)
router.get('/thongketheoloai', async (req, res) => {
    try {
        const questions = await hoidapModel.find();  
        let lichsuCount = 0;
        let amthucCount = 0;
        let khoahocCount = 0;
        let dialyCount = 0;
        questions.forEach(question => {
            if (question.loai === "Lịch sử") {
                lichsuCount++;
            } else if (question.loai === "Ẩm thực") {
                amthucCount++;
            } else if (question.loai === "Khoa học") {
                khoahocCount++;
            } else if (question.loai === "Địa lý") {
                dialyCount++;
            }
        });
        res.status(200).json({
            data: {
                "Lịch sử": lichsuCount,
                "Ẩm thực": amthucCount,
                "Khoa học": khoahocCount,
                "Địa lý": dialyCount
            }
        });
    } catch (err) {
        res.status(400).json({ status: false, message: 'Có lỗi xảy ra' });
    }
});

// 9. (Lưu trữ câu hỏi)
router.put('/luutru', async (req, res) => {
    try {
        const { id } = req.body; 
        const question = await hoidapModel.findById(id);
        
        if (question) {
            question.archived = true;
            await question.save();
            res.status(200).json({ status: true, message: "Câu hỏi đã được lưu trữ thành công" });
        } else {
            res.status(404).json({ status: false, message: "Không tìm thấy câu hỏi" });
        }
    } catch (err) {
        res.status(400).json({ status: false, message: 'Có lỗi xảy ra' });
    }
});

// 10. (lấy những câu hỏi đã lưu)
router.get("/dsLuu", async (req, res) => {
    try {
        const hasLuu = await hoidapModel.find({luu: true});
        if(hasLuu.length == 0){
            res.status(404).json({ status: false, message: "Chưa có câu hỏi nào được lưu" });
        }else{
            res.status(200).json(hasLuu);
        }
    } catch (error) {
        res.status(400).json({ status: false, message: 'Có lỗi xảy ra' });
    }
});

module.exports = router;