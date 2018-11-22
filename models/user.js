const mongoose = require('../connect_nosql')

const User = mongoose.model('User', {
    username: String,
    // ...
})

exports.model = User;
exports.save = function(data, callback) {
    console.log(data);
    var new_user = new User(data);
    new_user.save(function(err,user){
        console.log(user.id);
        callback(err,user.id);
    })
    //User.insertMany(data).then(() => callback());
}