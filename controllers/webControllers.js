var express = require("express");
var app = express.Router();
var User = require("../models/user");
var ECGData = require("../models/ecgdata");
var ECGData12 = require("../models/ecgdata12");

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
    var limitation = req.query.limit || 3;
    if (to > 0){
        ECGData.find_intervalecg(id,from,to,function(err,ecgdata) {
            if(err) return res.send(err);
            console.log('data length:'+ecgdata.length);
            return res.json(ecgdata);
        });
    }
    else if(from >= 0){
        ECGData.find_limitecg(id,from,limitation,function(err,ecgdata) {
            if(err) return res.send(err);
            console.log('data length:'+ecgdata.length);
            return res.json(ecgdata);
        });
    }
    else{
        return res.send("undefined time");
    }
})

//return ecgdata12s from t1 to t2 by user_id
app.get('/ecgdata12/:id', function(req, res) {
    var id = req.params.id;
    var from = req.query.from;
    var to = req.query.to;
    var limitation = req.query.limit || 3;
    if (to > 0){
        ECGData12.find_intervalecg(id,from,to,function(err,ecgdata12) {
            if(err) return res.send(err);
            console.log('data12 length:'+ecgdata12.length);
            return res.json(ecgdata12);
        });
    }
    else if(from >= 0){
        ECGData12.find_limitecg(id,from,limitation,function(err,ecgdata12) {
            if(err) return res.send(err);
            console.log('data12 length:'+ecgdata12.length);
            return res.json(ecgdata12);
        });
    }
    else{
        return res.send("undefined time");
    }
})
module.exports = app;