const mongoose = require('../connect_nosql')

const User = mongoose.model('User', {
    username: String,
    // ...
})

exports.model = User;
