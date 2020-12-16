const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/user');
//const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login',  (req, res) => res.render('login'));

// Register Page
router.get('/register',  (req, res) => res.render('register'));

// Register Proccess
router.post('/register', function(req, res){
  const name = req.body.name;
  const username=req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

 req.checkBody('name', 'Name is required').notEmpty();
 req.checkBody('username', 'Username is required').notEmpty();
 req.checkBody('password', 'Password is required').notEmpty();
 req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if(errors){
    req.flash('error',err);
    res.render('register', {
      errors:errors
    });
  } else {
    let newUser = new User({
      name:name,
      username:username,
      password:password
    });

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newUser.password, salt, function(err, hash){
        if(err){
          req.flash('error',err);
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(function(err){
          if(err){
            req.flash('error',err);
            console.log(err);
            return;
          } else {
            req.flash('success_msg','You are now registered and can log in');
            res.redirect('/users/login');
          }
        });
      });
    });
  }
});

  
// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/');
});

module.exports = router;