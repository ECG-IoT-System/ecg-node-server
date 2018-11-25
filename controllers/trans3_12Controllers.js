var express = require("express");
var app = express.Router();
var Coef = require("../models/coef");
var User = require("../models/user");
var Ecgdata12 = require("../models/ecgdata12");


//upload coef by username or user_id
app.post('/upload/coef', function(req, res) {
    var name = req.query.name;
    var user_id = req.query.id;
    let cdata = req.body;
    var query =[];
    if(!user_id){
        User.model.findOne({ username: name }, '_id', function (err, result) {
            if (!result) return res.send('unknown user');
            console.log('uploadbyname:' + result);
            query = { user_id: result.id, F: cdata.F, K: cdata.K, HH: cdata.HH };
            console.log(query);
            var newCoef = new Coef.model(query);
            newCoef.save(function (err, coef) {
                if (err) return console.log('upload coef error:' + err);
                console.log('upload coef success');
                return res.send(coef.id);
            })
            // Coef.model.save(query, function (err, result) {
            //     if (err) return console.log('upload coef error:' + err);
            //     console.log('upload coef success');
            //     return res.send(result.id);
            // });
        });
    }
    else{
        query = { user_id: user_id, F: cdata.F, K: cdata.K, HH: cdata.HH };
        console.log(query);
        var newCoef = new Coef.model(query);
        newCoef.save(function(err,coef){
            if (err) return console.log('upload coef error:' + err);
            console.log('upload coef success');
            return res.send(coef.id);
        })
        // Coef.save(query, function (err, result) {
        //     if (err) return console.log('upload coef error:' + err);
        //     console.log('upload coef success');
        //     return res.send(result.id);
        // });
    }
})
//upload many coefs
app.post('/upload/coefs',function(req,res){
    Coef.save(req.body,function(err){
        if(err) return res.send(err);
        console.log('upload coef success');
        res.send({ status: 200, message: "ok" });
    })
})
//return all coefs
app.get('/coefs',function(req,res){
    // Coef.model.find({},function(err,result){
    //     if(err) return console.log('find all coef error:'+ err);
    //     res.json(result);
    // })
    var pipeline =[
        {"$lookup":{from:"users",localField:"user_id",foreignField:"_id",as:"user_info"}},
        {"$unwind":"$user_info"}, 
        {"$project": {"username":"$user_info.username","F":1,"K":1,"HH":1,"version":1}}
    ]
    Coef.model.aggregate(pipeline)
    .then(function(successCallback, errorCallback){
        if (errorCallback) return res.send(errorCallback);
        res.json(successCallback);
    });
})
//return coef by user_id and (version)
app.get('/coef/:id',function(req,res){
    var user_id = req.params.id;
    var version = req.query.v;
    if (!version){
        Coef.find_all_byuserid(user_id,function(err,result){
            if(err) return console.log('find coef error:'+ err);
            res.json(result);
        })
    }
    else{

        Coef.model.findOne({$and:[{user_id},{version}]},function (err, result) {
            if(err) return res.send(err);
            console.log(result);
            res.json(result);
        })
    }
    
})

//upload ecgdata12 by user_id
app.post('/upload/ecgdata12/:id',function(req,res){
    let data = req.body;
    let user_id = req.params.id;
    var body =[];
    //console.log(data);
    data.forEach((data, index) => {
        body.push({
            user_id,
            timestamp:data.time,
            L1:data.ecg[0],L2:data.ecg[1],L3:data.ecg[2],
            V1:data.ecg[3],V2:data.ecg[4],V3:data.ecg[5],V4:data.ecg[6],V5:data.ecg[7],V6:data.ecg[8],
            aVR:data.ecg[9],aVL:data.ecg[10],aVF:data.ecg[11],
        });
    })
    //console.log(body);
    Ecgdata12.save(body,function(err){
        if(err) return res.send(err);
        res.send({ status: 200, message: "ok" });
    })
})

module.exports = app;