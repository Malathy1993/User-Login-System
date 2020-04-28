var express = require('express');
var router = express.Router();
var User = require('../models/user')

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/* GET Register page. */
router.get('/register', function(req, res, next) {
  res.render('register', 
  { title: 'Register' 
  });
});

/* GET Login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

/* Handle Register POST method */
router.post('/register', function(req,res,next){
      // Get Form Values
      var name = req.body.name;
      var email = req.body.email;
      var username = req.body.username;
      var password = req.body.password;
      var confirm_password = req.body.confirm_password;

 // Check For Image Field
      if(req.files){
      console.log('Uploading File...');
        // File Info
        var profileImageName = req.files.profileImage.name;
        // var profileImageOriginalName = req.files.profileImage.originalname;
        // var profileImageMime = req.files.profileImage.mimetype;
        // var profileImagePath = req.files.profileImage.path;
        // var profileImageExt = req.files.profileImage.extension;
        // var profileImageSize = req.files.profileImage.size;
      }else{
        // Set a Default Image
        console.log('no File...');
        var profileImageName = 'noimage.png';
      }

      // Form Validation
      req.checkBody('name','Name is required').notEmpty();
      req.checkBody('email','Email is required').notEmpty();
      req.checkBody('email','Email is required').isEmail();
      req.checkBody('username','Username is required').notEmpty();
      req.checkBody('password', 'Password field is requried').notEmpty();
      req.checkBody('confirm_password','Passwords do not match').equals(req.body.password);
      
      var errors =  req.validationErrors();
    console.log("fileInfo",req.files);
 
    console.log("err",errors);

      // Check For Errors
      if(errors){
        // console.log("errors................");
          res.render('register',{
              errors:errors,
              name:name,
              email:email,
              username:username,
              password:password,
              confirm_password:confirm_password
          });

      }else{
        var newUser = new User({
          name:name,
          email:email,
          username:username,
          password:password,
          profileImage:profileImageName
        });

        // Create User
        User.createUser(newUser, function(err,user){
          if(err) throw err;
        })

        // Success Message
        req.flash("Success",'You are now registered and may log in')

        // res.location('/');
        res.redirect('/');
      }   
});


passport.serializeUser(function(user, done) {
  done(null, user.id);
});
 
passport.deserializeUser(function(id, done) {
  User.getUserById(id, function (err, user) {
    done(err, user);
  });
});

  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.getUserByUsername(username, function (err, user) {
        if (err) throw err;
        if (!user) {
          // console.log("Unknown User");
          return done(null, false,{message:"Unknown User"});
        }
        User.comparepassword(password,user.password,function(err,isMatch){
          if (err) throw err;
          if(isMatch){
            // console.log("Successfull!");
            return done(null,user);
          }
          else{
            // console.log("Invalid Password");
            return done(null, false, {message : "Invalid Password"});
            
          }
        })
      });
    }
  ));

  router.post('/login', 
           passport.authenticate('local', { failureRedirect: '/users/login',failureFlash: "Invalid Username or Password!" }),
          function(req, res) {
            // console.log("Authenticate Successfull!");
            req.flash("Success", "You are logged in")
            res.redirect('/');
          });

  router.get('/logout',function(req,res){
    req.logOut();
    req.flash("Success","You have logged out")
    res.redirect('/users/login')
  })
module.exports = router;
