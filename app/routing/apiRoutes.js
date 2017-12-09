var Human = require("../models/info.js");
var Image = require("../models/images.js");
var bulletinPost= require("../models/bulletin.js");
var request = require("request");
var bCrypt = require("bcrypt-nodejs");
var path = require('path');
var fileUpload = require('express-fileupload');
var s3 = require('s3');
var loginAuth =require("./userSignInAuth.js");
var fs = require("fs");
var bulletinPost = require("../models/bulletin.js");
module.exports = bulletinPost;

//config variables for up/download from s3

module.exports = function(passport, app, user) {
  var User = user;
  var LocalStrategy = require("passport-local").Strategy;
  app.get("/profile/user", loginAuth.isLoggedIn, function(req, res) {
    // finds the currently logged in user and returns their info to the profile page
    Human.findOne({
      where: {
        username: req.user.username
      }
    }).then(function(result) {
      return res.json(result);
    });
    //}
  });

  app.get("/profile_pic", loginAuth.isLoggedIn, function(req, res) {
     console.log(req.user);

     Image.findOne({
       where: {
         human_id: req.user.id
       }
     }).then(function(result) {
       if (result !== null) {
         var picObject=result.toJSON();
         console.log(picObject.img_url);

         var params = {
           localFile: "downloads/"+picObject.img_url,//destination folder
            };
         //download from aws to downloads folder
         var downloader = client.downloadFile(params);
         downloader.on('error', function(err) {
           console.error("unable to download:", err.stack);
         });
         downloader.on('progress', function() {
           console.log("progress", downloader.progressAmount, downloader.progressTotal);
         });
         downloader.on('end', function() {
           console.log("done downloading");
           // this plasters the downloaded aws picture onto the UI
           res.sendFile(path.resolve(__dirname +"/../../downloads/"+picObject.img_url));
           //delete pictures from local storage after pushing and pulling to and from aws
           setTimeout(function () {
             console.log("blahblah")
               if (fs.existsSync(path.resolve(__dirname +"/../../downloads/"+picObject.img_url))) { // check to ensure file still exists on file system
                   fs.unlink(path.resolve(__dirname +"/../../downloads/"+picObject.img_url)); // delete file from server file system after 60 seconds
               }
           }, 60000);
         });
       } else {
         //ensures the server doesn't crash if a picture isn't uploaded to aws
         console.log("Image not uploaded to AWS")
       };

     });
   });


  // Get all user API -- maybe comment out the below if things get funky
  app.get("/api/users", function(req, res) {
    Human.findAll({}).then(function(results) {
      res.json(results);
    });
  });
  //
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id).then(function(user, errors) {
      if (user) {
        done(null, user);
      } else {
        done(errors, null);
      }
    });
  });
  passport.use(
    "local-signup",
    new LocalStrategy({
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {
      var generateHash = function(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
      };
      User.findOne({
        where: {
          username: username
        }
      }).then(function(user) {
        if (user) {
          console.log("Wrong Place!!!");
          return done(null, false, {
            message: "That username is already taken"
          });
        } else {
          //var info=req.body;
          var userPassword = generateHash(password);
          console.log("!!!" + req.body.first_name);
          //console.log("!!!"+req.body.first_name);
          var info = req.body;
          info.username = username;
          info.password = userPassword;
          var address = req.body.autocomplete;
          var queryUrl =
          "https://maps.googleapis.com/maps/api/geocode/json?address=" +
          address +
          "&key=AIzaSyBaw-4l7qS4b_L7kXhuHViE2smEu1k34Dw";

          request(queryUrl, function(error, res, body) {
            //
            if (!error && res.statusCode === 200) {
              //
              var bObject = JSON.parse(res.body);
              var lat = bObject["results"][0].geometry.location.lat;
              var lng = bObject["results"][0].geometry.location.lng;
              info.address_lat = lat;
              info.address_lng = lng;

              User.create(info).then(function(newUser, created) {
                if (!newUser) {
                  return done(null, false);
                }
                if (newUser) {
                  console.log(info);
                  return done(null, newUser);
                }
              });

            } else {
              console.log(error);
            }
          });
        }
      });
    }
  )
);
//LOCAL SIGNIN
passport.use(
  "local-signin",
  new LocalStrategy({
    //  console.log("made it here1");
    // by default, local strategy uses username and password, we will override with username
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },
  function(req, username, password, done) {
    //  console.log("made it here2");
    var User = user;
    var isValidPassword = function(userpass, password) {
      return bCrypt.compareSync(password, userpass);
    };
    User.findOne({
      where: {
        username: username
      }
    })
    .then(function(user) {
      if (!user) {
        console.log("'username does not exist'");
        return done(null, false, {
          message: "username does not exist"
        });
      }
      if (!isValidPassword(user.password, password)) {
        alert("wrong password");
        return done(null, false, {
          message: "Incorrect password."
        });
      }
      var userinfo = user.get();
      return done(null, userinfo);
    })
    .catch(function(err) {
      return done(null, false, {
        message: "Something went wrong with your Signin"
      });
    });
  }
)
);

//gets all the bulletin posts from the bulletin table and posts them to the api/Requests route which is grabbed from the front end bulletin board
app.get("/api/Requests", loginAuth.isLoggedIn, function(req, res) {
  bulletinPost.findAll({}).then(function(results) {
    res.json(results);
  });
});


// amazon aws route

app.use(fileUpload());

app.post("/uploadForm", loginAuth.isLoggedIn, function(req, res) {

  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }
  console.log(req.body);

  var imageInfo = {
    img_url: req.files.uploadedPic.name, //TODO generate random number so that someone's profpic file-name doesn't override someone else's
    human_id: req.user.id
  }

//delete any previous versions of prof pic that user had stored in database
Image.destroy({
  where: {
    human_id: req.user.id
  }
}).then(
    Image.create(imageInfo)
    .then(function(results) {
      //  res.json(results);
    })
    .catch(function(err) {
      console.log("Data err with upload");
      console.log(err);
    })
  );
  // The name of the input field (i.e. "uploadedPic") is used to retrieve the uploaded file
  var uploadedPic = req.files.uploadedPic;

  // Use the mv() method to place the file somewhere on your server
  uploadedPic.mv('uploads/' + req.files.uploadedPic.name, function(err) {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }

    // Upload to S3
    var params = {
      localFile: 'uploads/' + req.files.uploadedPic.name,

    var uploader = client.uploadFile(params);
    uploader.on('error', function(err) {
      console.error("unable to upload:", err.stack);
      res.status(500).send(err.stack);
    });
    uploader.on('end', function() {
      console.log('File uploaded!');
      res.redirect('/profile');
      //delete pictures from local storage after pushing and pulling to and from aws
      if (fs.existsSync("uploads/" + req.files.uploadedPic.name)) { // check to ensure file still exists on file system
          fs.unlink("uploads/" + req.files.uploadedPic.name); // delete file from server file system after 60 seconds
      }
    });
  });

}); //end human aws post route

}; //end module.exports
