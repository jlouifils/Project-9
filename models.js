'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Course = mogoose.model('Course', CourseSchema);

const User = mogoose.model('User', UserSchema);

const CourseSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref:"User"},
  title: String,
  estimatedTime: String,
  materialsNeeded: String
});

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  emailAddess: String,
  password: String,
});

module.exports = {Course, User}

