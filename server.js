
//Import the necessary libraries/declare the necessary objects
var express = require("express");
var myParser = require("body-parser");
var app = express();
// var consql = require("./connect_sql");
var ECGData = require("./models/ecgdata")
var User = require("./models/user")
var MacMapping = require("./models/macmapping")

app.use(myParser.urlencoded({ extended: true }));
app.use(myParser.json());

app.post("/upload/rssi", function (req, res) { 
    consql.insert_Rssi(req.body, function(error) {
        res.send(error);
    });
    console.log(req.body.mac);
    //consql.insert(req.body);
});

// save gateway data
app.post("/upload/gateway", function (req, res) {
    console.log(req.body)
    let data = req.body.data;
    let time = req.body.time;

    var count = data.length;
    var sample_rate = (time[1] - time[0]) / count;
  
    var body = [];
  
    // ---- if user or mac mapping not exist --- start
    // user { username: "pei" }
    // macmapping { user_id: user.id, device_id: 1, mac: "ab12cd34ef56" }
    var query = { },
        update = { username: "pei" },
        options = { upsert: true, new: true, setDefaultsOnInsert: true };

    // Find the document
    User.model.findOneAndUpdate(query, update, options, function(error, result) {
        if (error) return;
        console.log(result)
        // do something with the document
        
        var query = { },
        update = { user_id: result.id, device_id: 1, mac: "ab12cd34ef56" },
        options = { upsert: true, new: true, setDefaultsOnInsert: true };

        // Find the document
        MacMapping.model.findOneAndUpdate(query, update, options, function(error, result) {
            if (error) return;
            console.log(result)
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

        ECGData.save(body, function(error) {
            res.send({ status: 200, message: "success" });
        });
    });

    // console.log(req.body.mac);
    // consql.insert(req.body);
});

//Start the server and make it listen for connections on port 8080

let port = process.env.PORT || 8080;
app.listen(port, function() {
    console.log('server start on port', port)
});