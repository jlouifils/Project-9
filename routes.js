'use strict'

const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const express = require('express');
const authorized = require('basic-auth');

const User = require("./models").User
const Course = require('./models').Course

router.param("id", function(req,res,next,id){
  Question.findById(req.params.id, function(err, doc){
      if(err) return next(err);
      if(!doc) {
          err = new Error("Not Found");
          err.status = 404;
          return next(err);
      }
      req.question = doc;  
      return next();
  });    
});

                            /**COURSE ROUTES */
//GET COURSE
//ROUTE FOR COURSES
router.get("/api/courses", function(req, res, next) {
  Course.find({})
              .exec(function(err,course){
                  if(err) return next(err);
                  res.json(course);
              });
});

//GET COURSE BY ID
//ROUTE FOR SPECIFIC COURSES
router.get("/api/courses/:id", function(req, res,) {
  res.json(req.course);    
});

// Basic-Auth and bcrypt.compare()
// middleware to authorize user
router.use((req, res, next) => {
  const aUser = authorized(req); // basic-auth 
  if(aUser) {
    User.findOne({ emailAddress: aUser.name })
      .exec((err, user) => {
        if(err) {
          return next(err);
        } else if(!user) {
          err = new Error('Email is required');
          err.status = 401;
          return next(err);
        };
        bcryptjs.compare(aUser.pass, user.password, (err, res) => {
          if (res) {
            req.user = user;
            return next()
          } else {
            err = new Error('Incorrect password');
            err.status = 401;
            return next(err);
          };
        });
      });
    };
});

//POST COURSE
// ROUTE FOR CREATING COURSE
router.post("/api/courses", function(req, res, next) {
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