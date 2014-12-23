"use strict";

var mongoose = require('mongoose'); // MongoDB integration

// Implement the eatz API:

var fs = require('fs'),
    // GraphicsMagick (gm) for Node is used to resize user-supplied images
    gm = require('gm').subClass({imageMagick:true}),
    config = require(__dirname + '/../config'),  // port#, other params
    express = require("express"),
    bcrypt = require("bcrypt");

// Connect to database
mongoose.connect('mongodb://' + config.dbhost+ '/' + config.dbname);


mongoose.connection.on('errror', console.error.bind(console, 'MongoDB connection failed:'));

// Schemas

var UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true }
});

var DishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  venue: { type: String, required: true },
  info: { type: String },
  numbr: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  province: { type: String, required: true },
  url: { type: String },
  lat:{type: Number, required: true},
  lng:{type: Number, required: true},
  image: { type: String }
});


// Models
var User = mongoose.model('User', UserSchema);
var Dish = mongoose.model('Dish', DishSchema);

// This line will ensure name and venue are distinct pair in the database
DishSchema.index({"name":1, "venue":1}, {unique:true, dropDups:true});

// "exports" is used to make the associated name visible
// to modules that "require" this file (in particular app.js)

// heartbeat response for server API
exports.api = function(req, res){
  res.send(200, '<h3>Eatz API is running!</h3>');
};


exports.editDish = function(req,res){
  var dish = new Dish(req.body);
  delete req.body._id;
  Dish.findByIdAndUpdate({"_id": req.params.id}, 
    {$set : req.body}, 
    function(err, result){
    if (!err){
    req.name = result.name;
    req.venue = result.venue;
    req.info = result.info;
    req.numbr = result.numbr;
    req.street = result.street;
    req.city = result.city;
    req.province = result.province;
    req.url = result.url;
    req.image = result.image;
    req.lat = result.lat;
    req.lng = result.lng;
    res.send({'name':result.name, 'venue':result.venue, 'info':result.info
        , 'numbr':result.numbr, 'street':result.street, 'city':result.city
        , 'province':result.province, 'url':result.url, '_id':result.id
        ,'lat': result.lat, 'lng':result.lng});      
    }
    else{
      if (err.errmsg.indexOf("E11000") != -1){
          res.send(403, "Sorry. dish "+dish.name+" at "+dish.venue+" is already in the Eatz database");
      }
      else{
        res.send(500, "Unable to create dish at this time; please try again later "
      + err.message);        
      }      
    }
  });
};

// handle add dish 
exports.addDish = function(req,res){
  // make a dish entry
	var dish = new Dish(req.body);
	dish.save(function (err, result) {
    console.log(err);
    if (!err) {  // save successful, result contains saved dish model
		req.name = result.name;
		req.venue = result.venue;
		req.info = result.info;
		req.numbr = result.numbr;
		req.street = result.street;
		req.city = result.city;
		req.province = result.province;
		req.url = result.url;
		req.image = result.image;
    req.lat = result.lat;
    req.lng = result.lng;
		res.send({'name':result.name, 'venue':result.venue, 'info':result.info
				, 'numbr':result.numbr, 'street':result.street, 'city':result.city
				, 'province':result.province, 'url':result.url, '_id':result.id
        ,'lat': result.lat, 'lng':result.lng});
    }
    else {  // save failed
      if (err.err.indexOf("E11000") != -1){
          res.send(403, "Sorry. dish "+dish.name+" at "+dish.venue+" is already in the Eatz database");
      }
      else
        res.send(500, "Unable to create dish at this time; please try again later "
      + err.message);
      }
  });
};

// Return all the dishes for the browse view
exports.getDishes = function(req, res){
  Dish.find({}, function(error, dishes){
    if (!error)
      res.send(200, dishes);
    else{
      res.send(404, "Sorry, dishes doesn't exists");
    }
  });
};


// retrieve an individual dish model, using it's id as a DB key
exports.getDish = function(req, res){
    Dish.findOne({'_id':req.params.id}, function(err, dish) {
        if (err) {
            res.send(500, "Sorry, unable to retrieve dish at this time (" 
                +err.message+ ")" );
        } else if (!dish) {
            res.send(404, "Sorry, that dish doesn't exist; try reselecting from browse view");
        } else {
            res.send(200, dish);
        }
    });
};

exports.deleteDish = function(req, res){
	Dish.findOne({'_id':req.params.id}, function(err, dish) {
		if (err) {
			res.send(500, "Sorry, unable to retrieve dish at this time (" 
				+err.message+ ")" );
		} else if (!dish) {
			res.send(404, "Sorry, that dish doesn't exist; try reselecting from browse view");
		} else {
			Dish.remove({'_id':dish.id}, function(error, removeResult){
				if (!err){
					res.send(200, "Dish delete successfully");
				} else{
					res.send(500, "Cannot delete Dish");
				}
			});
		}
	});
};

// signup new username
exports.signup = function(req, res) {
  var user = new User(req.body);  // instantiate model with request attributes
  // generate random salt value for new username
  bcrypt.genSalt(10, function(err, salt) {
    // secure hash of user password with salt value
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;  // hash encodes both hash-result and salt
      // create DB record for new username
      user.save(function (err, result) {
        if (!err) {  // save successful, result contains saved user model
          req.session.auth = true;
          req.session.username = result.username;
          req.session.userid = result.id;
          res.send({'username':result.username, 'userid':result.id});
        } 
        else {  // save failed
          // could alternatively detect duplicate username using find()
          if (err.err.indexOf("E11000") != -1) {  // duplicate username error
            res.send(403, "Sorry, username <b>"+user.username+"</b> is already taken");
          } 
          else {  // any other DB error
            res.send(500, "Unable to create account at this time; please try again later "
             + err.message);
          } 
        }
      });
    });
  });
};

// isAuth
exports.isAuth = function(req, res){
  if (req.session.auth){
    res.send({'username':req.session.username, 'userid':req.session.userid, 'auth':req.session.auth});
  }
  else{
    res.send({'username':"", 'userid':"", 'auth':req.session.auth});
  }
};

// signin
exports.auth = function(req, res){
  console.log(req.body.username);
  console.log(req.body.password);
  // if the current request is login
  if (req.body.login){
    var username =  req.body.username; // get username ;
    var password =  req.body.password; // get password ;
    if(!username || !password){
        res.send(403, "Invalid Username/Password");
    }
    else{
      User.findOne({'username':username}, function(err, user){
        if(!err){
          console.log(user);
          bcrypt.compare(password, user.password, function(err, result){
            if (result){
              req.session.auth = true ; // user logged in
              req.session.username = user.username;
              req.session.userid = user.id;
                  // extend session-life if "remember-me" checked on login form
              if(req.body.remember){
                req.session.cookie.maxAge =1000*60*5;
              }
              res.send({'username':user.username, 'userid':user.id, 'session':req.session});
            }
            else{ 
              res.send(403, "Invalid Username/Password");
            }
          });
        }
        else{
            // invalid login
            res.send(403, "No Such User exists!");
        }
      });
    }
  }

  // otherwise logout the user
  else{
      req.session.auth = false;
      req.session.username = undefined
      res.send({'username':undefined, 'userid':undefined});
  }
};

exports.uploadImage = function (req, res) {
    console.log(req.files);
    // req.files is an object, attribute "file" is the HTML-input name attr
    var filePath = req.files.file.path,   // ADD CODE
        tmpFile = (filePath.split("/").pop()).split(".")[0],  // ADD CODE to extract root file name 
        imageURL = filePath.split(".")[0];
        // process EditView image
    console.log(filePath);    
    console.log(tmpFile);
    gm(filePath).resize(360, 270).write(imageURL + '_360.jpg', function(err) {  // ADD CODE
        if (!err) {
            gm(filePath).resize(240, 180).write(imageURL + '_240.jpg', function(err) {  // ADD CODE
                if (!err) {
                    fs.unlink(filePath, function (err) {
                        if (err){
                            console.log('ERROR: ' + err.message);
                        } else {
                            console.log('successfully deleted : '+ filePath);
                        }
                    });
                    res.send(200, tmpFile)
                } else {
                    res.send(500, "Unable to resize; please try again later " + err.message);
                }
            });
        } else {
            res.send(500, "Unable to resize; please try again later " + err.message);
        }
    });
};
