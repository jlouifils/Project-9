'use strict';

// require modules needed for project
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const jsonParser = require("body-parser").json;
const routes = require("./routes");
const app = express(); // create the Express app



// setup morgan which gives us http request logging
app.use(morgan('dev'));


//use jsonparser to accept json data coming into the routes
app.use(jsonParser());


//Connect to MongoDB server
mongoose.connect("mongodb://localhost:27017/fsjstd-restapi"); //name of the database is  fsjstd-restapi


//monitor status of request
var db = mongoose.connection; 


db.on("error", function(err){ 
	console.error("There was a connection error:", err);
});


db.once("open", function(){ 
	console.log("database connection has been successful!");
});


//connect app.js to routes, and have api appear in the url
app.use("/api", routes);


// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});


// catch  404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error("Not Found"); 
  err.status = 404 
  next(err)
  });


// Error Handler
app.use(function(err, req, res, next){ 
	res.status(err.status || 500);  
	res.json({ 
		error: {
			message: err.message
		}
	});
});


// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});