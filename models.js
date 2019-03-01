'use strict';

const mongoose = require('mongoose'),
 Schema = mongoose.Schema;

const CourseSchema = new Schema({
  user:{type: mongoose.Schema.Types.ObjectId, ref:"User"},
  title: String,
  estimatedTime: String,
  materialsNeeded: String
});

const UserSchema = new Schema({
  firstName: {type: String, required: [true, "First name is required"]},
  lastName: {type: String, required: [true, "Last name is required"]},
  emailAddress: {type: String, required: [true, "Email address is required"]},
  password: {type: String, required: [true, "Password is required"]}
});

const Course = mongoose.model('Course', CourseSchema);

const User = mongoose.model('User', UserSchema);

module.exports = {
  Course, User
}

