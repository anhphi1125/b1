var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mongoose = require('mongoose');
require("./models/productsModel");
require("./models/SinhVienModel");
require("./models/HoiDapModel");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require("./routes/products");
var sinhvienRouter = require("./routes/SinhVien");
var hoidapRouter = require("./routes/HoiDap");
// const { default: mongoose } = require('mongoose');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//connect database
mongoose.connect('mongodb+srv://anhphi1125:jDlCugMnnvyiYLOR@cluster0.10l8k.mongodb.net/sinhviens')
  .then(() => console.log('>>>>>>>>>> DB Connected!!!!!!'))
  .catch(err => console.log('>>>>>>>>> DB Error: ', err));

//localhost:3000/
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productRouter);
app.use('/sinhvien', sinhvienRouter);
app.use('/hoidap', hoidapRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
