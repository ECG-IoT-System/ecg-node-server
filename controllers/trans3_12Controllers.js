var express = require("express");
var app = express.Router();
var Coef = require("../models/coef");
var User = require("../models/user");
var Ecgdata12 = require("../models/ecgdata12");

//upload coef by username
app.post('/upload/coef/:name', function(req, res) {
    var name = req.params.name;
    let cdata = req.body;
    User.model.findOne({username:name},'_id',function(err,result){
        if(!result) return res.send('unknown user');
        console.log('uploadbyname:'+result);
        var query = { user_id:result.id, F : cdata.F, K : cdata.K,HH : cdata.HH }
        console.log(query);
        Coef.save(query,function(err,result){
            if(err) return console.log('upload coef by name error:'+ err);
            console.log('upload coef by name success');
            res.send({ status: 200, message: "ok" });
        });
    });
})
//upload coef by user_id
app.post('/upload/coef',function(req,res){
    Coef.save(req.body,function(err){
        if(err) return res.send(err);
        console.log('upload coef success');
        res.send({ status: 200, message: "ok" });
    })
})
//
app.get('/coefs',function(req,res){
    Coef.model.find({},function(err,result){
        if(err) return console.log('find all coef error:'+ err);
        res.json(result);
    })
})
//return coef by user_id
app.get('/coef/:id',function(req,res){
    Coef.find_all_byuserid(req.params.id,function(err,result){
        if(err) return console.log('find coef error:'+ err);
        res.json(result);
    })
})
app.post('/upload/ecgdata12/:id',function(req,res){
    var data = req.body;
    var user_id = req.params.id;
    var body =[];
    data.foreach()
    Ecgdata12.save(req.body,function(err){
        if(err) return res.send(err);
        res.send({ status: 200, message: "ok" });
    })
})
module.exports = app;