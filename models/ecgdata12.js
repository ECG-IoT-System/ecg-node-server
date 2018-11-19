const mongoose = require('../connect_nosql')

const ECGData12 = mongoose.model('ECGData12', {
    user_id: { type: 'ObjectId', ref: 'User' },
    time: Number,
    lead1: Number,
    // ...
});

exports.model = ECGData12;