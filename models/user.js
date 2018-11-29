const mongoose = require('../connect_nosql')
const User = mongoose.model('User', {
    username: String,
    // ...
})

exports.model = User;
exports.save = function (data, callback) {
    User.find({ username: data.username }) //check if the user exists
    .limit(1)
    .countDocuments() 
    .exec(function(err, users) {
        if (users) return callback('user already exists', {});
        new User(data).save(function (err, user) {
            callback(err, user);
        })
    })

}

exports.findAll = function (data, callback) {
    var pipeline =[
        {"$lookup":{from:"ecgdatas",localField:"_id",foreignField:"user_id",as:"ecg_datas"}},
        {"$unwind":{"path":"$ecg_datas","preserveNullAndEmptyArrays": true}},
        {"$group":{_id:{user_id:"$_id",username:"$username"},lasttime: {$last: "$ecg_datas.timestamp" }}},
        {"$project":{_id:0,_id:"$_id.user_id",username:"$_id.username",lasttime:1,status:{ $gte:["$lasttime",Date.now()-120000]}}} 
    ]
    User.aggregate(pipeline).exec(function(err, users) {
        console.log(users);
        callback(err, users);
        });
    // User.find(data, callback);
}

exports.findById = function (id, callback) {
    User.findOne({ _id: id}, callback);
}

exports.findByUsername = function (username, callback) {
    User.findOne({ username }, callback);
}