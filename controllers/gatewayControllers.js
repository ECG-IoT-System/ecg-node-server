var express = require("express");
var app = express.Router();
var ECGData = require("../models/ecgdata")
var User = require("../models/user")
var MacMapping = require("../models/macmapping")
var Gsensor = require("../models/gsensor")

app.post("/upload/rssi", function (req, res) { 
    consql.insert_Rssi(req.body, function(error) {
        res.send(error);
    });
    console.log(req.body.mac);
});

// save gateway data
app.post("/upload/gateway", function (req, res) {
    console.log(req.body)
    let data = req.body.data;
    let gsensor = req.body.gsensor;
    let time = req.body.time;

    var count = data.length;
    var sample_rate = (time[1] - time[0]) / count;
    var gcount = gsensor.axisX.length;
    var gsample_rate = (time[1] - time[0]) / gcount;

    var body = [];
    var gbody =[];
  
    // ---- if user or mac mapping not exist --- start
    // user { username: "pei" }
    // macmapping { user_id: user.id, device_id: 1, mac: "ab12cd34ef56" }
    var query = { },
        update = { username: "unknown" },
        options = { upsert: true, new: true, setDefaultsOnInsert: true };

    // Find the document
    User.model.findOneAndUpdate(query, update, options, function(error, result) {
        if (error) return;
        console.log('result:'+result)
        // do something with the document
        
        var query = {};
        query.push
        update = { user_id: result.id, device_id: 1, mac: "ab12cd34ef56" },
        options = { upsert: true, new: true, setDefaultsOnInsert: true };

        // Find the document
        MacMapping.model.findOneAndUpdate(query, update, options, function(error, result) {
            if (error) return console.log(error);
            console.log('fine doc:'+result)
            // do something with the document
            console.log(result.id)
        });
    });
    // ---- if user or mac mapping not exist --- end
    

    MacMapping.model.findOne({ mac: req.body.mac }, function (err, result) {
        if (!result) return res.send({ status: 404, message: "Not Found" })
        
        let device_id = result.device_id
        let user_id = result.user_id

        data.forEach((data, index) => {
            body.push({
                user_id,
                device_id,
                data,
                timestamp: time[0] + index * sample_rate,
            });
        });
        //console.log(body);
        ECGData.save(body, function(error) {
            if(error) return res.send(error);
        });

        for (let i=0 ; i < gcount ; i++ ){
            gbody.push({
                user_id,
                device_id,
                axisX : gsensor.axisX[i],
                axisY : gsensor.axisY[i],
                axisZ : gsensor.axisZ[i],
                timestamp: time[0] + i * gsample_rate,
          });
        }    
        Gsensor.save(gbody, function(error) {
            if(error) return res.send(error);
        });
        return res.send({ status: 200, message: "ok" });
    });
    
    // console.log(req.body.mac);
    // consql.insert(req.body);
});

module.exports = app;