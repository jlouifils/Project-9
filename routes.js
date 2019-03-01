'use strict';

const express = require('express');
const router = express.Router();
const Course = require("./models").Course;
const User = require('./models').User;
const bcrypt = require('bcryptjs');
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
// AUTHENTHICATE USERS
const authUser = (req, res, next) => {

  User.findOne({ emailAddress: authorized(req).name}, function(err, user){
    if(user) {
      const auth = bcrypt.compareSync(authorized(req).pass, user.password);
      if(auth) {
        console.log(`Successful username ${cUser.emailAddress}`);
        req.currentUser = cUser;
        next(); 
      } else {
        err = new Error("failure");
        err.status = 401;
        next(err);
      }
    } else {
      err = new Error("User Not Found!");
      err.status = 401;
      next(err);
    }
  });
};



                                  /**COURSE ROUTES */
//GET COURSE
//ROUTE FOR COURSES
router.get("/courses", function(req, res, next) {
  Course.find({})
              .populate('user','firstName lastName')
              .exec(function(err,courses){
                  if(err) return next(err);
                  res.json(courses);
              });
});

//GET COURSE BY ID
//ROUTE FOR SPECIFIC COURSES
router.get("/courses/:id", function(req, res,) {
  res.json(req.Course);    
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
  course.save(function(err, Course){
      if(err) return next(err);
      res.status(201);
      res.json(Course);
  });
});

//PUT COURSE
// UPDATE COURSE ROUTES
router.put("/courses/:id", function(req, res, next) {
  const id = req.params.id;
  Course.findOneAndUpdate({_id: id})
  .exec()
  .then(result =>{
    res.status(204).json(result);
  })
   .catch(err => {
  console.log(err);
  res.status(500).json({
    error: err
  });  
  });
});

//DELETE COURSE
//DELETE COURSE ROUTES
router.delete("/courses/:id", authUser, function(req, res,) {
  const id = req.params.id;
  Course.remove({_id: id})
  .exec()
  .then(result =>{
    res.status(204).json(result);
  })
   .catch(err => {
  console.log(err);
  res.status(500).json({
    error: err
  });  
  });
});

                                    /**USER ROUTES */

//GET USER
//ROUTE FOR USER
router.get("/users", authUser, function(req, res, next) {
  const cUser = req.currentUser 
  User.find({})
              .exec(function(err,users){
                  if(err) return next(err);
                  res.json(cUser);
              });
});

//POST USER
// ROUTE FOR CREATING USER
router.post("/users", function(req, res,) {
  const user = new User ({
    firstName: req.body.firstName, 
    lastName: req.body.lastName,
    emailAddress: req.body.emailAddress,
    password: bcrypt.hashSync(req.body.password, 10),
  });
  user.save().then(result =>{
    console.log(result);
    res.location('/api');
    res.status(201).json('User Created!');
  })
  .catch(err =>{
    console.log(err);
    res.status(400).json({error: err});
  });
});




module.exports = router;