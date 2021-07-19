var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var authenticate = require('./authenticate');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
const mongoose = require('mongoose');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var fileUploadRouter = require('./routes/fileUpload');
const { RequestHeaderFieldsTooLarge } = require('http-errors');

const url = 'mongodb://localhost:27017/rankme';
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log("Connected correctly to server");
}, (err) => {
  console.log(err);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  name: 'session-id',
  secret: 'secret-ya-habiby',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));
app.use(passport.initialize());
app.use(passport.session());

//these roots will be accessible without requiring authentication
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/fileupload', fileUploadRouter);

function auth(req, res, next)
{

  if(!req.user)
  {
    var err = new Error('You are not authenticated!');
    err.status = 403;
    return next(err);
  }
  else
  {
    next();
  }
}

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

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
  res.render('error', { title: 'Express' });
});

module.exports = app;