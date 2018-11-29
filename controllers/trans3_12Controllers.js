var express = require("express");
var app = express.Router();
var Coef = require("../models/coef");
var User = require("../models/user");
var Ecgdata12 = require("../models/ecgdata12");


// upload coef by username or user_id
// upload/coef?name=david
// upload/coef?id=12345
app.post('/upload/coef', function(req, res) {
    var name = req.query.name;
    var user_id = req.query.id;
    let cdata = req.body;

    new Promise(function(resolve, reject) {
        query = { 
            version: cdata.version, 
            description: cdata.description, 
            F: cdata.F, 
            K: cdata.K, 
            HH: cdata.HH 
        };

        if (user_id) {
            query.user_id = user_id;
            return resolve(query)
        }

        console.log(name);

        User.findByUsername({ username: name }, function (err, result) {
            if (err) return res.send(err);
            if (!result) return res.send('unknown user');
            console.log('uploadbyname:' + result);
            query.user_id = result.id;
            resolve(query)
        })
    }).then(function(query) {
        console.log(query);
        var newCoef = new Coef.model(query);
        newCoef.save(function (err, coef) {
            if (err) return console.log('upload coef error:' + err);
            console.log('upload coef success');
            return res.send(coef.id);
        })
    })

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
    Coef.find_all_coefs(function(successCallback, errorCallback){
        if (errorCallback) return res.send(errorCallback);
        res.json(successCallback);
    })
})
//return coef by user_id and (version)
// /coef/:id?v=1
// /users/:id/coefs       // => [ ]
// /users/:id/coefs?v=1   // => { }
// /users/:id/coefs/:id   // => { }
app.get('/users/:id/coefs',function(req,res){
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