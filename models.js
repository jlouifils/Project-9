'use strict';

const mongoose = require('mongoose'),
 Schema = mongoose.Schema;

const CourseSchema = new Schema({
  user:{type: Schema.Types.ObjectId, ref:"User"},
  title: String,
  estimatedTime: String,
  materialsNeeded: String
});

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  emailAddess: String,
  password: String
});

const Course = mongoose.model('Course', CourseSchema);

const User = mongoose.model('User', UserSchema);

module.exports = {
  Course, User
}

