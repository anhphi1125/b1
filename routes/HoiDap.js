var express = require("express");
var router = express.Router();

var hoidapModel = require("../models/HoiDapModel");


// 1. POST /questions (Tạo mới câu hỏi)
router.post('/add', async (req, res) => {
    try {
        const { question, answer, category } = req.body;
        const newQuestion = new hoidapModel({ question, answer, category });
        await hoidapModel.create(newQuestion);
        res.status(200).json({ status: true, message: 'Thêm thành công' })
    } catch (err) {
        res.status(400).json({ status: false, message: 'có lỗi xảy ra' });
    }
});

// 2. GET /questions (Lấy danh sách câu hỏi)
router.get('/dscauhoi', async (req, res) => {
    try {
        var list = await hoidapModel.find().select("_id cauhoi");
        res.status(200).json(list);
    } catch (error) {
        res.status(400).json({ status: false, message: 'Có lỗi xảy ra' });
    }
});

// 3. GET /questions/{id} (Lấy chi tiết câu hỏi)
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

// 4. PUT /questions/{id} (Cập nhật câu hỏi)
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
            res.status(404).json({ status: false, message: "Không tìm thấy sản phẩm" });
        }
    } catch (err) {
        res.status(400).json({ status: false, message: 'Có lỗi xảy ra' });
    }
});

// 5. DELETE /questions/{id} (Xóa câu hỏi)
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

// 6. GET /questions/search (Tìm kiếm câu hỏi theo thể loại)
router.get('/questions/search', async (req, res) => {
    try {
        const { loai} = req.query;
        const questions = await hoidapModel.find({ loai: loai});
        res.status(200).json(questions);
    } catch (err) {
        res.status(400).json({ status: false, message: 'Có lỗi xảy ra' });
    }
});

// 7. POST /questions/{id}/answer (Thêm câu trả lời cho câu hỏi)
router.put('/editTraLoi', async (req, res) => {
    try {
        const { id, traloi} = req.body;
        const updatedQuestion = await hoidapModel.findById(id);
        if (updatedQuestion) {
            updatedQuestion.traloi = traloi ? traloi : updatedQuestion.traloi;
            await updatedQuestion.save();
            res.status(200).json({ status: true, message: "Đã sửa thành công" });
        } else {
            res.status(404).json({ status: false, message: "Không tìm thấy sản phẩm" });
        }
    } catch (err) {
        res.status(400).json({ status: false, message: 'Có lỗi xảy ra' });
    }
});

// 8. GET /questions/stats (Thống kê số lượng câu hỏi theo thể loại)
router.get('/thongketheoloai', async (req, res) => {
    try {
        const stats = await hoidapModel.find();
        const result = {};

        for (let i = 0; i < stats.length; i++) {
            const category = stats[i].category;

            if (result[category]) {
                result[category] += 1;
            } else {
                result[category] = 1;
            }
        }

        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ status: false, message: 'Có lỗi xảy ra' });
    }
});

// 9. PUT /questions/{id}/archive (Lưu trữ câu hỏi)
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

// 10.

module.exports = router;