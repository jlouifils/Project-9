'use strict';
// modules
const express = require("express");
var router = express.Router

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

                            /*User Routes*/
//GET /api/users
router.get('/users', function(req, res, next){
    User,findOne({}).exec(function(err, users){
        if(err) return next(err);
        res.json(users);
    });
});

//POST /api/users
router.post('/users', function(req,res,next){
    const user = new User(req.body);
    user.save(function(err){
        if(err) return next(err);
        res.location("/api/users");
        res.status(201);
        res.json();
    });
});

//                              Course Routes

//GET /api/courses
router.get('/courses', function(req, res, next){
    Course.find({}).exec(function(err, courses){
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

//PUT /api/courses/:id
router.put("/courses/:id", function(req,res,next){
    req.course.update(req.body, function(err, result){
        if(err) return next(err);
        res.status(204);
        res.json(result);
    });
});

//DELETE /api/courses/:id
router.delete("/courses/:id", function(req,res,next){
    req.course.remove(function(err){
        if(err) return next(err);
        res.json();
    });
});







module.exports = router;