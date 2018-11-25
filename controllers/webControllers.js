var express = require("express");
var app = express.Router();
var User = require("../models/user");
var ECGData = require("../models/ecgdata");

//return all users
app.get('/users', function(req, res) {
    User.model.find({},function(err,users){
        if(err) res.send(err);
        res.json(users);
    });
})

//return ecgdatas from t1 to t2 by user_id
app.get('/ecgdata/:id', function(req, res) {
    var id = req.params.id;
    var from = req.query.from;
    var to = req.query.to;
    ECGData.find_intervalecg(id,from,to,function(err,ecgdata) {
        if(err) res.send(err);
        res.json(ecgdata);
        console.log('data length:'+ecgdata.length);
    });
    // res.send({
    //     id: req.params.id,
    //     from: from,
    //     to:to,
    //     query: req.query,
    //     body: req.body
    // });
})
module.exports = app;