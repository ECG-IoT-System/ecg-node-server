
//Import the necessary libraries/declare the necessary objects
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
// var consql = require("./connect_sql");
var ECGData = require("./models/ecgdata")
var User = require("./models/user")
var MacMapping = require("./models/macmapping")

var gateway_controller = require('./controllers/gatewayControllers')

var router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', gateway_controller)

app.get('/', function(req, res) {
    res.send('Hello World!');
})
//about users
app.get('/users', function(req, res) {
    User.find(function(err,users){
        if(err) res.send(err);
        res.json(users);
    });
})
//about ecgdatas
app.get('/users/:id', function(req, res) {
    ECGData.find(req, function(err,ecgdata) {
        if(err) res.send(err);
        res.json(ecgdata);
        console.log('retrieve data:'+ecgdata);
    });
    // res.send({
    //     id: req.params.id,
    //     from: from,
    //     to:to,
    //     query: req.query,
    //     body: req.body
    // });
})
app.post('/upload/:id', function(req,res){
    console.log(req.body);
});

app.post('/mapping', function(req,res){
    MacMapping.addmapping(req.body,function(error){
        if(error) res.send(error);
        res.send({ status: 200, message: "ok" });
    })
    console.log(req.body);
});

app.post('/createuser',function(req,res){
    User.save(req.body,function(error){
        if(error) res.send(error);
    })
});


// 將路由套用至應用程式
app.use('/', router);

//Start the server and make it listen for connections on port 8080

let port = process.env.NODE_PORT || 8080;
app.listen(port, function() {
    console.log('server start on port', port)
});