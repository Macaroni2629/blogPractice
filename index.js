// Get express, an installed package from node_modules.
const express = require("express");

// Create an express application.
const app = express();

// NEW: Get our database engine, sqlite3, and load (or create) the database file at `blog.db`
const sqlite3 = require('sqlite3');
const database = new sqlite3.Database('./blog.db');

// Tell the application which port to use.
const port = process.env.PORT || 8000;

// Tell the app to listen for incoming requests on the desired port.
app.listen(port, function () {
  console.log("App listening on port: " + port);
});

// NEW: Run SQL Query to create Posts table (if it doesn't already exist)
// This will specify each field and what type of data it should hold
database.run(`CREATE TABLE IF NOT EXISTS Posts( 
  id INTEGER PRIMARY KEY, 
  title TEXT, 
  subtitle TEXT, 
  body TEXT
)`);

// Associate the url path "/" with a given function.
app.get("/", function (request, response) {
  response.send("<h1>Welcome to Simple Blog!</h1>");
});