// Get express, an installed package from node_modules.
var express = require("express");
var bodyParser = require('body-parser');
// Create an express application.
var app = express();
// Load pg package
var pg = require("pg");
// Set up a pool variable (more specifically, a "pool" of available database connections)
var pool = new pg.Pool();
// Tell the application which port to use.
var port = process.env.PORT || 8000;
// View files can be found in the views folder
app.set('views', './views/');
// Specify view template engine
app.set('view engine', 'ejs');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Tell the app to listen for incoming requests on the desired port.
app.listen(port, function () {
    console.log("App listening on port: " + port);
});
// Run SQL query to create Posts table (if it doesn't already exist)
pool.query("CREATE TABLE IF NOT EXISTS Posts (\n  ID SERIAL PRIMARY KEY,\n  title TEXT,\n  subtitle TEXT,\n  body TEXT\n);");
app.get("/", function (request, response) {
    // Specify SQL query that will fetch all Posts
    // UPDATED: End sql query with semicolon
    var sql = "SELECT * FROM Posts;";
    // UPDATED: Use pool.query instead of database.all
    pool.query(sql, function (error, results) {
        if (error) {
            response.send("<h1>Error retrieving posts</h1>");
        }
        else {
            // UPDATED: Use results.rows to get posts info
            response.render("home", { posts: results.rows });
        }
    });
});
app.get("/createPost", function (request, response) {
    response.sendFile(__dirname + "/newPostForm.html");
});
app.post("/createPost", function (request, response) {
    // Specify the SQL query that will insert the new post into the Posts table
    // UPDATED: End query with semicolon, change method for using request properties
    var sql = "INSERT INTO Posts (title, subtitle, body) VALUES (($1), ($2), ($3));";
    var sqlParameters = [request.body.title, request.body.subtitle, request.body.body];
    // UPDATED: Use pool.query to run sql query
    pool.query(sql, sqlParameters, function (error) {
        // If there was an error, tell the user
        if (error) {
            response.send("<h1>Error Saving New Blog Post.</h1>");
            // Otherwise, tell the user that the save was successful.
        }
        else {
            response.send("<h1>New Blog Post Saved!</h1>");
        }
    });
});
app.get("/viewPost/:post_id", function (request, response) {
    // Specify query that will find the post with an id matching post_id in the URL path
    // UPDATED: semicolon, parameter syntax
    var sql = "SELECT * from Posts WHERE id = ($1);";
    var sqlParameters = [request.params.post_id];
    // UPDATED: Run sql query using pool.query
    pool.query(sql, sqlParameters, function (error, result) {
        if (error) {
            console.log(error);
            response.send("<h1>Blog post not found.</h1>");
        }
        else {
            // Render "blogPostDetail.ejs" and provide it with the post to display
            // UPDATED: use first element in result.rows
            response.render("blogPostDetail", { post: result.rows[0] });
        }
    });
});
app.get("/editPost/:post_id", function (request, response) {
    // Specify query that will find the post with an id matching post_id
    // UPDATED: semicolon, parameter syntax
    var sql = "SELECT * from Posts WHERE id = ($1);";
    var sqlParameters = [request.params.post_id];
    // UPDATED: Run sql query using pool.query
    pool.query(sql, sqlParameters, function (error, result) {
        if (error) {
            response.send("<h1>Blog post not found.</h1>");
        }
        else {
            // UPDATED: Render "editPostForm.ejs" and provide it with the post to edit
            response.render("editPostForm", { post: result.rows[0] });
        }
    });
});
app.post("/editPost/:post_id", function (request, response) {
    // UPDATED query, parameters syntax
    var sql = "UPDATE Posts \n    SET title = ($1), subtitle = ($2), body = ($3) \n    WHERE id = ($4);";
    var sqlParameters = [request.body.title, request.body.subtitle, request.body.body, request.params.post_id];
    // UPDATED: Run sql query using pool.query
    pool.query(sql, sqlParameters, function (error) {
        if (error) {
            console.log(error);
            response.send("<h1>Error editing post.</h1>");
        }
        else {
            // If save was successful, redirect to that post's detail page
            response.redirect("/viewPost/".concat(request.params.post_id));
        }
    });
});
app.post('/deletePost/:post_id', function (request, response) {
    // UPDATED: semicolon, parameters syntax
    var sql = "DELETE FROM Posts WHERE id = ($1);";
    var sqlParameters = [request.params.post_id];
    // UPDATED: Run sql query using pool.query
    pool.query(sql, sqlParameters, function (error) {
        if (error) {
            response.send("<h1>Error deleting post.</h1>");
        }
        else {
            response.redirect('/');
        }
    });
});
