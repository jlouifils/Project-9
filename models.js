'use strict';

const mongoose = require("mongoose");
Schema = mongoose.Schema;
bcrypt = require("bcrypt");
SALT_WORK_FACTOR = 10;

//                          Create User Schema
const UserSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    emailAddress: {type: String, required: true},
    password: {type: String, required: true}
});

UserSchema.pre('save', function(next){
    const user = this;
    if(!user.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if(err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return (err);
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
    });
};

const User = mongoose.model("User", UserSchema);

module.sxports.User = User;

const CourseSchema = new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, default: UserSchema._id},
    title: {type: String, required: true },
    description: {type: String, required: true},
    estimatedTime: String,
    materialsNeeded: String
});

const Course = mongoose.model("course", CourseSchema);

module.exports.Course = Course;