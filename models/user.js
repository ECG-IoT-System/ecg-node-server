const mongoose = require('../connect_nosql')

const User = mongoose.model('User', {
    username: String,
    // ...
})

exports.model = User;
exports.find = function(callback){
    User.find({},function(err,users){
        if(err) console.log('err'+ err);
        callback(err,users);
    })
}