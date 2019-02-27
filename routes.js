'use strict'

const express = require('express');
const router = express.Router();
const User = require("./models").User;
const Course = require('./models').Course;
const bcryptjs = require('bcryptjs');
const authorized = require('basic-auth');

router.param("id", function(req,res,next,id){
  Course.findById(req.params.id, function(err, doc){
      if(err) return next(err);
      if(!doc) {
          err = new Error("Not Found");
          err.status = 404;
          return next(err);
      }
      req.Course = doc;  
      return next();
  }).populate('user');    
});

const authUser =(req, res, next) => {
  User.findOne({ emailAdress: authorized(req).name}, function(err, user){
    if(user) {
      const auth = bcryptjs.compareSync(authorized(req).pass, user.password);
      if(auth) {
        console.log(`Successful username ${user.emailAddress}`);
      } else {
        err = new Error("failure");
        err.status = 401;
        next(err);
      }
    } else {
      err = new Error("User Not Found!");
      err.status = 404;
      next(err);
    }
  });
};



                            /**COURSE ROUTES */
//GET COURSE
//ROUTE FOR COURSES
router.get("/courses", function(req, res, next) {
  Course.find({})
              .exec(function(err,courses){
                  if(err) return next(err);
                  res.json(courses);
              });
});

//GET COURSE BY ID
//ROUTE FOR SPECIFIC COURSES
router.get("/courses/:id",authUser, function(req, res, next) {
  res.json(req.courses);    
});

//POST COURSE
// ROUTE FOR CREATING COURSE
router.post("/courses", authUser, function(req, res, next) {
  const course = new Course({
    user: req.user, 
    title: req.body.title,
    description: req.body.description,
    estimatedTime: req.body.estimatedTime,
    materialsNeeded: req.body.materialsNeeded
  });
  course.save(function(err, course){
      if(err) return next(err);
      res.status(201);
      res.json(course);
  });
});

module.exports = router;