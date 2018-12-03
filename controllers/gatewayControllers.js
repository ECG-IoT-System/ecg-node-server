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
    //console.log(req.body.mac);
});

// save gateway data
app.post("/upload/gateway", function (req, res) {
    //console.log(req.body)
    let data = req.body.data;
    let gsensor = req.body.gsensor;
    let time = req.body.time;

    var count = data.length;
    var sample_rate = (time[1] - time[0]) / count;
    var gcount = gsensor.length / 3;
    var gsample_rate = (time[1] - time[0]) / gcount;

    var body = [];
    var gbody =[];
    // MacMapping.model.find({ mac: req.body.mac }).limit(1).sort({$natural:-1}).exec(callback);
    
    MacMapping.model.findOne({ mac: req.body.mac ,status:true},function (err, result) {
        if (!result) return res.send({ status: 404, message: "Mac Address Not Found" })
        if (err) return console.log(err);
        let device_id = result.device_id
        let user_id = result.user_id
        //console.log(result);
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
            if(error) console.log(err);
        });

        for (let i=0 ; i < gcount ; i++ ){
            gbody.push({
                user_id,
                device_id,
                axisX : gsensor[i*3],
                axisY : gsensor[i*3+1],
                axisZ : gsensor[i*3+2],
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