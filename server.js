//Import the necessary libraries/declare the necessary objects
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var multer = require("multer");
var upload = multer();

var ECGData = require("./models/ecgdata")
var User = require("./models/user")
var MacMapping = require("./models/macmapping")

var gateway_controller = require('./controllers/gatewayControllers')
var web_controller = require('./controllers/webControllers')
var transport3_12_controller = require('./controllers/trans3_12Controllers')

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', gateway_controller)
app.use('/', web_controller)
app.use('/', transport3_12_controller)

app.get('/users.html', function (req, res) {
    // res.send('Hello World!');
    User.findAll({}, function (err, users) {
        if (err) return res.send(err);
        return res.render(__dirname + '/views/users/registration', { users })
    })
})

app.get('/users/:id', function (req, res) {
    console.log(req.params.id)

    new Promise(function(resolve, reject) {
        User.findById({ _id: req.params.id }, function (err, user) {
            if (err) return res.send(err);
            console.log(user)
            resolve(user)
        })
    })
    .then(function(user) {
        MacMapping.findByUserId(user.id, function(err, macs){
            if (err) return res.send(err);
            console.log(macs)
            return res.render(__dirname + '/views/users/show', { user, macs })
        })
    })
    
})


app.post('/upload/:id', function (req, res) {
    console.log(req.body);
});
app.post('/', upload.any(), function (req, res, next) {
    console.log(req.files);
    return res.send(req.files);
});

//mac mapping
app.post('/macmapping', function (req, res) {
    console.log(req.body);
    MacMapping.addmapping(req.body, function (error) {
        if (error) res.send(error);
        res.send({ status: 200, message: "ok" });
    })
    console.log(req.body);
});

// user register
app.post('/registration', function (req, res) {
    User.save(req.body, function (error, user) {
        if (error) return res.send(error);
        res.send(user);
    })
});

// Start the server and make it listen for connections on port 8080
let port = process.env.NODE_PORT || 8080;
app.listen(port, function () {
    console.log('server start on port', port)
});