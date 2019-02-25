'use strict';

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//                          Create User Schema
const UserSchema = new Schema({
    firstName: { type: mongoose.Schema.Types.ObjectId, ref:'user'},
    lastName: { type: String, required: true},
    emailAddress: { type: String, required: true},
    password: { type: String, required: true}
});

const User = mongoose.model("User", UserSchema);

module.exports.User = User;

const CourseSchema = new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, default: UserSchema._id},
    title: {type: String, required: true },
    description: {type: String, required: true},
    estimatedTime: String,
    materialsNeeded: String
});

const Course = mongoose.model("course", CourseSchema);

module.exports.Course = Course;