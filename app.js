var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

app.get('/api', (req,res, next) => {
  res.json({'unix':  new Date().getTime(),'utc': new Date().toUTCString()});
});

app.get('/api/:date',(req, res, next) => {
  const dateReq = req.params.date;
  // 1. check format of date
  const dateRe = /\d{4}-\d{2}-\d{2}|\d{8,16}/;
  const unixRe = /\d{8,16}/;

  if(dateRe.test(dateReq)) {
    // 2. convert date to utc
    const utc = unixRe.test(dateReq) ?  new Date(dateReq * 1000).toUTCString(): new Date(dateReq).toUTCString();
    // 3. convert date to unix
    const unix = unixRe.test(dateReq) ? dateReq : new Date(dateReq).getTime() / 1000;
    res.json({'unix':  unix, 'utc': utc});
  } else {
    res.json({'error': 'invalid date'});
  }
});

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
