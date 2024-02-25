// Get express, an installed package from node_modules.
const express = require("express");

// Create an express application that'll
// handle http requests and http responses.
const app = express();

// If this file is hosted on a remote server (e.g. Heroku),
// use process.env.PORT, which should be 80, the port used
// for HTTP traffic. If no such port is defined, it means
// we're running on our local machine. In that case, use
// port 8000, which is commonly used for local development.
const port = process.env.PORT || 8000;

// Tell the app to listen for incoming requests on
// the desired port. After we know the app is listening,
// log a message so that we know it's working.
app.listen(port, function () {
  console.log("App listening on port: " + port);
});

// Associate the url path "/" with a given function.
// Each time "/" is requested, the associated
// function will run. In this case, the function
// responds with our HTML string.
app.get("/", function (request, response) {
  response.send(HTML);
});

// HTML for the only webpage in our application.
const HTML = `<h1>Welcome to NAME's site!</h1>`