'use strict';
// modules
const bcrypt = require('bcryptjs');
const express = require("express");
const router = express.Router();
const auth = require('basic-auth');


//models form models.js
const Course = require("./models").Course
const User = require("./models").User

/*the callback will be executed when (id) is present,
the  id parameter takes a value from id*/
router.param("id", function(req,res,next,id){
    Course.findById(id, function(err, doc){
        if(err) return next(err);
        if(!doc) {
            err = new Error("Not Found");
            err.status = 404
            return next(err);
        }
        req.course = doc;
        return next();
    });
});

//This middle-where function will authenticate users
const authenticateUser = async (req, res, next) =>{
    let message = null;
  
    // Parse the user's credentials from the Authorization header.
    const credentials = auth(req);
  
    // If the user typed the Authorization header...
    if (credentials) {
      console.log(credentials)
      // Attempt to retrieve the user from the data store
      // by their email (i.e. the user's "key"
      // from the Authorization header).
      const user = await User.find({emailAddress: credentials.name})[0];
       
      // If a user was successfully retrieved from the data store...
      console.log(credentials.pass)
      console.log(user.password)
      if (user) {
        // Use the bcryptjs npm package to compare the user's password typed
        // (from the Authorization header) to the user's password sent in req.body in postman
        const authenticated = bcryptjs
       
        .compareSync(credentials.pass, user.password);
        // If the passwords match...
        if (authenticated) {
          console.log(`Authentication successful for user: ${req.body.firstName} `);
  
          // Then store the retrieved user object on the request object
          // so any middleware functions that follow this middleware function
          // will have access to the user's information.
          req.currentUser = user;
        } else {
          message = `Authentication failure for user:  ${req.body.firstName} `;
        }
      } else {
        message = `User not found for email: ${credentials.name}`;
      }
    } else {
      message = 'Auth header not found';
    }
  
    // If user authentication failed...
    // Return a response with a 401 Unauthorized HTTP status code.
    if (message) {
      console.warn(message);
  
      // Return a response with a 401 Unauthorized HTTP status code.
      res.status(401).json({ message: 'Access Denied' });
    } else {
      // Or if user authentication succeeded...
      // Call the next() method.
      next();
    }
  };
  
  
  //---USER ROUTES
  
  
  //GET /api/users 200, THIS WORKS IN POSTMAN
  //This Route returns the currently authenticated user
  router.get('/users', authenticateUser, (req, res) => {
    //within the route handler, the current authenticated user's information is retrieved from the Request object's currentUser property:
    const user = req.currentUser;
  //we use the Response object's json() method to return the current user's information formatted as JSON:
    res.json({
      firstName: user.firstName
      
    });
  });
  
  
  //POST /api/users 201, THIS WORKS IN POSTMAN   
  //This Route creates a user, sets the Location header to "/", and returns no content
  router.post('/users',  (req, res, next) => {
    var user = new User(req.body); //create a new user document, and grab data for the user on request.body
    // Hash the new user
    user.password = bcryptjs.hashSync(user.password);
    user.save(user, (err) => { //call save() on user to saved it to the database and pass a callback function
      if(err) return next(err); 
      res.location("/api/users"); //set location header
      res.status(201); //respond with a 201 code to indicate to the client that a document was saved successfully
      res.json(); //do not return anything on body
    });
  });
  
  
                            /*User Routes*/
//GET /api/users
//This Route returns a list of courses (including the user that owns each course)
router.get('/courses',  (req, res, next) => {
    Course.find({}) 
          .exec((err, courses) => { 
            if(err) return next(err); 
            res.json(courses);
          });
});


//POST /api/users
router.post('/users', function(req,res,next){
    const user = new User(req.body);
    user.password = bcryptjs.hashSync(user.password);
    user.save(user, (err) => {
        if(err) return next(err);
        res.location("/api/users");
        res.status(201);
        res.json();
    });

});

//                              Course Routes

//GET /api/courses
//This Route returns a list of courses (including the user that owns each course)
router.get('/courses',  (req, res, next) => {
    Course.find({}) 
          .exec((err, courses) => { 
            if(err) return next(err); 
            res.json(courses);
          });
});


//GET /api/courses/:id
router.get('/courses/:id', function(req, res,next){
    res.json(req,couse);
});

//POST /api/course
router.post("/cousres", function(req,res,next){
    const course = new Course(req.body);
    course.save(function(err){
        if(err) return next(err);
        res.location("/api/courses")
            res.status(201);
            res.json();
    });
});

//GET /api/courses/:id
router.get('/courses/:id',  (req, res,next) => {
    res.json(req.course);
   });

//POST /api/courses 
router.post("/courses", authenticateUser, (req, res, next) => {
	var course = new Course(req.body); 
	course.save(function(err){ 
    if(err) return next(err);
    res.location("/api/courses")
		res.status(201); 
		res.json(); 
	});
});



//PUT /api/courses/:id 
router.put("/courses/:id", authenticateUser, (req, res, next) => { 
  req.course.update(req.body, (err) => { 
    if(err) return next(err);
    res.status(204);
		res.json(); 
  })   
});



//DELETE /api/courses/:id 
router.delete("/courses/:id", authenticateUser, (req, res, next) => {
  req.course.remove(function(err){ 
  if(err) return next(err);
    res.json(); 
  });   
});






module.exports = router;