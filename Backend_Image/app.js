var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const imageRouter = require('./src/routes/imageRoutes');

var app = express();

const cors = require("cors");

const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:8080", "https://journal-app-frontend.app.cloud.cbh.kth.se",
    "https://journal-app-hapi.app.cloud.cbh.kth.se"]
};

app.use(cors(corsOptions))

// view engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', imageRouter);


const controller = require("./src/controllers/imageController.js");

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
