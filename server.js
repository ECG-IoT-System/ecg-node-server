
//Import the necessary libraries/declare the necessary objects
var express = require("express");
var myParser = require("body-parser");
var httppost = express();
var consql = require("./connect_sql");

httppost.use(myParser.urlencoded({ extended: true }));
httppost.use(myParser.json());
httppost.post("/", function (request, response) {
    console.log(request.body[0].count); 
    consql.insert(request.body);
    response.send("success");
});

//Start the server and make it listen for connections on port 8080

httppost.listen(8080);