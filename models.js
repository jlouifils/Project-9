'use strict';

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//                          Create User Schema
const UserSchema = new Schema({
    firstName:  String, 
    lastName: String,
    emailAddress: String, 
    password:  String
});

const CourseSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref:'user'},
    title: String, 
    description: String, 
    estimatedTime: String,
    materialsNeeded: String
});

const Course = mongoose.model("course", CourseSchema);

const User = mongoose.model('User', UserSchema);

module.exports.Course = {
    Course, User
}