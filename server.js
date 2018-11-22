
//Import the necessary libraries/declare the necessary objects
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
// var consql = require("./connect_sql");
var ECGData = require("./models/ecgdata")
var User = require("./models/user")
var MacMapping = require("./models/macmapping")

var gateway_controller = require('./controllers/gatewayControllers')
var web_controller = require('./controllers/webControllers')
var transport3_12_controller = require('./controllers/trans3_12Controllers')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', gateway_controller)
app.use('/', web_controller)
app.use('/', transport3_12_controller)

app.get('/', function(req, res) {
    res.send('Hello World!');
})
app.post('/upload/:id', function(req,res){
    console.log(req.body);
});

//
app.post('/mapping', function(req,res){
    MacMapping.addmapping(req.body,function(error){
        if(error) res.send(error);
        res.send({ status: 200, message: "ok" });
    })
    console.log(req.body);
});

// user register
app.post('/registration',function(req,res){
    User.save(req.body,function(error,userid){
        if(error) return res.send(error);
        res.send({user_id:userid});
    })
});



// Start the server and make it listen for connections on port 8080

let port = process.env.NODE_PORT || 8080;
app.listen(port, function() {
    console.log('server start on port', port)
});