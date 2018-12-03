var express = require("express");
var app = express.Router();
var User = require("../models/user");
var ECGData = require("../models/ecgdata");
var ECGData12 = require("../models/ecgdata12");
var MacMapping = require("../models/macmapping");

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
})

app.get('/user/:id', function (req, res) {
    console.log(req.params.id)

    new Promise(function(resolve, reject) {
        User.findById({ _id: req.params.id }, function (err, user) {
            if (err) return res.send(err);
            //console.log(user)
            resolve(user)
        })
    })
    .then(function(user) {
        MacMapping.findByUserId(user.id, function(err, macs){
            if (err) return res.send(err);
            //console.log(macs)
            return res.render(__dirname + '/views/users/show', { user, macs })
        })
    })
    
})

//return all users
app.get('/users', function (req, res) {
    User.findAll({}, function (err, users) {
        console.log('user');
        if (err) return res.send(err);
        return res.json(users);
    });
})

//return ecgdatas from t1 to t2 by user_id
// query from, to, limit
app.get('/ecgdata/:id', findEcgdataByUserId)
app.get('/users/:id/ecgdata', findEcgdataByUserId)

function findEcgdataByUserId(req, res) {
    var id = req.params.id;
    var from = req.query.from; // null
    var to = req.query.to; // 151,,..
    var limitation = req.query.limit || 2304;

    if (!from) return res.json({ status: "403", message: "from time is required"});

    if (to > 0) {
        ECGData.find_intervalecg(id, from, to, ecgDataCallback);
    }
    else {
        ECGData.find_limitecg(id, from, limitation, ecgDataCallback);
    }
    
    function ecgDataCallback(err, ecgdata) {
        if (err) return res.json(err);
        //console.log('data length:' + ecgdata.length);
        return res.json(ecgdata);
    }
}

//return ecgdata12s from t1 to t2 by user_id
app.get('/users/:id/ecgdata12', function (req, res) {
    var id = req.params.id;
    var from = req.query.from;
    var to = req.query.to;
    var limitation = req.query.limit || 3;

    if (!from) return res.json({ status: "403", message: "from time is required"});

    if (to > 0) {
        ECGData12.find_intervalecg(id, from, to, ecgData12Callback);
    }
    else {
        ECGData12.find_limitecg(id, from, limitation, ecgData12Callback);
    }

    function ecgData12Callback(err, ecgdata12) {
        if (err) return res.json(err);
        //console.log('data12 length:' + ecgdata12.length);
        return res.json(ecgdata12);
    }
})
//return ecgdata12s from t1 to t2 by user_id
app.get('/user/:id/macs', function (req, res) {
    var user_id = req.params.id;
    MacMapping.findByUserId(user_id, function(err, macs){
        if (err) return res.send(err);
        //console.log(macs)
        return res.json(macs);
    })
    
})

module.exports = app;