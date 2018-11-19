
//Import the necessary libraries/declare the necessary objects
var express = require("express");
var myParser = require("body-parser");
var app = express();
var consql = require("./connect_sql");

app.use(myParser.urlencoded({ extended: true }));
app.use(myParser.json());


app.post("/upload/rssi", function (request, response) { 
    consql.insert_Rssi(request.body, function(error) {
        response.send(error);
    });
    console.log(request.body.mac);
    //consql.insert(request.body);
});

// save gateway data
app.post("/upload/gateway", function (request, response) { 
    consql.insert_Rssi(request.body, function(error) {
        response.send(error);
    });
    console.log(request.body.mac);
    //consql.insert(request.body);
});





//Start the server and make it listen for connections on port 8080

app.listen(8080);