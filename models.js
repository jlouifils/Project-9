//in this file I wil create the schema and model


//require packages
var mongoose = require('mongoose'), //require mongoose
  Schema = mongoose.Schema //store schema constructor as a local variable
 

//***CREATE USER SCHEMA***
var UserSchema = new Schema({
  firstName: String, 
  lastName: String,
  emailAddress: String,
  password:  String  
});



//***CREATE COURSE SCHEMA***
var CourseSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User'}, // (_id from the users collection) by using population
  title: String, 
  description: String, 
  estimatedTime: String,
  materialsNeeded: String
});

//create the course model using using Mongoose's model()
var Course = mongoose.model("Course", CourseSchema);

//create the user model using Mongoose's model()
var User = mongoose.model("User", UserSchema);


//export Course and User model, then require them into the routes file
module.exports = {
  Course, User,
}
