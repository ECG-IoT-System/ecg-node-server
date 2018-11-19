const mongoose = require('../connect_nosql')

const Record = mongoose.model('Record', {
    user_id: { type: 'ObjectId', ref: 'User' },
    // ...
})

exports.model = Record;
