var express = require("express");
var router = express.Router();

var productModel = require("../models/productsModel");
var upload = require("../ultil/uploadConfig");
var sendMail = require("../ultil/mailConfig");

//localhost:3000/products/all
// - Lấy danh sách tất cả các sản phẩm
//bất đồng bộ là không trình tự
router.get("/all", async function (request, respond) { //req gửi đi, res trả về
    try {
        var list = await productModel.find();//lấy tất cả
        respond.status(200).json(list);
    } catch (error) {
        respond.status(400).json({status: false, message: 'Có lỗi xảy ra'});
    }
});

// - Lấy danh sách tất cả các sản phẩm có số lượng lớn hơn 20
//localhost:3000/products/grearerTwenty
router.get("/grearerTwenty", async function (req, res) {
    try {
        const {num} = req.query;
        var list = await productModel.find({productQuantity: {$gt: num}});
        res.status(200).json(list);
    } catch (error) {
        res.status(400).json({status: false, message: 'Có lỗi xảy ra'});
    }
});

// - Lấy danh sách sản phẩm có giá từ 200 đến 500
//localhost:3000/products/twoToFive
router.get("/twoToFive", async function (req, res) {
    try {
        const {from, to} = req.query;
        var list = await productModel.find({productPrice: {$gte: from, $lte: to}});
        res.status(200).json(list);
    } catch (error) {
        res.status(400).json({status: false, message: 'Có lỗi xảy ra'});
    }
});

// - Lấy danh sách sản phẩm có số lượng nhỏ hơn 10 hoặc giá lớn hơn 300
//localhost:3000/products/quantityOrPrice
router.get("/quantityOrPrice", async function (req, res) {
    try {
        const {soluong, gia} = req.query;
        var list = await productModel.find({$or: [{productQuantity: {$lt: soluong}}, {productPrice: {$gt: gia}}]});
        res.status(200).json(list);
    } catch (error) {
        res.status(400).json({status: false, message: 'Có lỗi xảy ra'});
    }
});

// - Lấy thông tin chi tiết của sản phẩm
//localhost:3000/products/getdetailProd
router.get("/getdetailProd", async function (req, res) {
    try {
        const {name} = req.query;
        var list = await productModel.find({productName: name});
        res.status(200).json(list);
    } catch (error) {
        res.status(400).json({status: false, message: 'Có lỗi xảy ra'});
    }
});

//thêm sản phẩm mới
router.post("/add", async function (req, res) {
    try {
        const {productName, productPrice, productQuantity} = req.body;

        const newItem = {productName, productPrice, productQuantity};
        await productModel.create(newItem);
        res.status(200).json({status: true, message: 'Thêm thành công'})
    } catch (error) {
        res.status(400).json({status: false, message: 'có lỗi xảy ra'});
    }
});

//chỉnh sửa
// router.put("/edit", async function (req, res) {
//     try {
//             const {id, productName, productPrice, productQuantity} = req.body;

//             //tìm sản phẩm cần chỉnh
//             const findProd = await productModel.findById(id);

//         if(findProd){
//             //chỉnh sửa
//             findProd.productName = productName ? productName : findProd.productName;//toán tử 3 ngôi
//             findProd.productPrice = productPrice ? productPrice : findProd.productPrice;
//             findProd.productQuantity = productQuantity ? productQuantity : findProd.productQuantity;
//             await findProd.save();
//             res.status(200).json({status: true, message: 'Chỉnh sửa thành công'});
//         }else{
//             res.status(400).json({status: false, message: 'Không tìm thấy sản phẩm'});
//         }
//     } catch (error) {
//         res.status(400).json({status: false, message: 'có lỗi xảy ra' + error});
//     } 
// });

router.put("/edit", async function (req, res) {
    try {
      const { id, productName, productPrice, productQuantity } = req.body;
  
      // tìm sp cần chỉnh sửa
      const findPro = await productModel.findById(id);
      if (findPro) {
        findPro.productName = productName ? productName : findPro.productName;
        findPro.productPrice = productPrice ? productPrice : findPro.productPrice;
        findPro.productQuantity = productQuantity
          ? productQuantity
          : findPro.productQuantity;
        await findPro.save();
        res.status(200).json({ status: true, message: "Đã sửa thành công" });
      } else {
        res
          .status(404)
          .json({ status: false, message: "Không tìm thấy sản phẩm" });
      }
    } catch (error) {
      res.status(404).json({ status: false, message: "Đã có lỗi xảy ra" + error});
    }
  });


//upload file
// localhost:3000/products/
router.post('/upload', [upload.single('image')],
    async (req, res, next) => {
        try {
            const { file } = req;
            if (!file) {
                return res.json({ status: 0, link : "" }); 
            } else {
                const url = `http://localhost:3000/images/${file.filename}`;
                return res.json({ status: 1, url : url });
            }
        } catch (error) {
            console.log('Upload image error: ', error);
            return res.json({status: 0, link : "" });
        }
    });


//upload file
// localhost:3000/products/uploads
router.post('/uploads', [upload.array('image', 9)],
    async (req, res, next) => {
        try {
            const { files } = req;
            if (!files) {
               return res.json({ status: 0, link : [] }); 
            } else {
              const url = [];
              for (const singleFile of files) {
                url.push(`http://localhost:3000/images/${singleFile.filename}`);
              }
                return res.json({ status: 1, url : url });
            }
        } catch (error) {
            console.log('Upload image error: ', error);
            return res.json({status: 0, link : [] });
        }
    });

//send mail
// localhost:3000/products/send-mail
router.post("/send-mail", async function(req, res, next){
    try{
      const {to, subject, content} = req.body;
  
      const mailOptions = {
        from: "daothianhphi <anhphi1125@gmail.com>",
        to: to,
        subject: subject,
        html: content
      };
      await sendMail.transporter.sendMail(mailOptions);
      res.json({ status: 1, message: "Gửi mail thành công"});
    }catch(err){
      res.json({ status: 0, message: "Gửi mail thất bại" + err});
    }
  });

module.exports = router;

//lấy danh sách theo giá trị người dùng nhập vào
// router.get("/findOld", async function (req, res) {
//     //query
//     const {old} = req.query;//localhost:3000/users/{findOld}?old=xxx&value01=xx
//     ...
//     //param
//     const {old} = req.param;//localhost:3000/users/{findOld2/:oldX}/xxx
//     ...
// });