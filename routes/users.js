var express = require('express');
const passport = require('passport');
var User = require('../models/user');

var userRouter = express.Router();
userRouter.use(express.json());

userRouter.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {

    if(err) 
    {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else
    {
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registration Successful!'});
      })
    }
  })
});

userRouter.post('/login', passport.authenticate('local'), (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, status: 'You are successfull logged in'});
});

userRouter.get('/logout', (req, res, next) => {
  if(req.session)
  {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else
  {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = userRouter;
