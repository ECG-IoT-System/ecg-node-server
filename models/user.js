const mongoose = require('../connect_nosql')
const User = mongoose.model('User', {
    username: String,
    // ...
    lasttime: Number,
    lastesttime_12L: Number,
    lastesttime_af: Number,

})

exports.model = User;
exports.save = function (data, callback) {
    User.find({ username: data.username }) //check if the user exists
        .limit(1)
        .countDocuments()
        .exec(function (err, users) {
            if (users) return callback('user already exists', {});
            data.lasttime = 0;
            new User(data).save(function (err, user) {
                callback(err, user);
            })
        })

}

exports.findAll = function (data, callback) {
    var pipeline = [
        {$project : { _id: 1, username : 1 , lasttime : 1 ,status:{ $gte:['$lasttime',Date.now()-120000]}} }
    ]
    User.aggregate(pipeline).exec(function (err, users) {
        //console.log(users);
        callback(err, users);
    });

}

exports.findById = function (id, callback) {
    User.findOne({ _id: id }, callback);
}

exports.findByUsername = function (username, callback) {
    User.findOne({ username }, callback);
}

exports.update_usertime = function (user_id, time, callback) {
    User.updateOne({ _id: user_id, lasttime: { $lte: time } }, { $set: { lasttime: time } }, callback);
}

exports.update_usertime_12 = function (user_id, time, callback) {
    User.updateOne({ _id: user_id, lasttime_12L: { $lte: time } }, { $set: { lasttime_12L: time } }, callback);
}