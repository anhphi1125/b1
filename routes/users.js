var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


module.exports = router;

//lấy toàn bộ danh sách user có độ tuổi lớn hơn X
//với X là số tuổi mà người dùng nhập vào
//localhost:3000/users/findOld?oldX=xxx
router.get('/findOld', async function (req, res) {
  //query
  const {old} = req.query;
});
