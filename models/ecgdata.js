const mongoose = require('../connect_nosql')

const ECGData = mongoose.model('ECGData', {
    user_id: { type: 'ObjectId', ref: 'User' },
    device_id: Number,
    data: Number,
    timestamp: Number,
});

exports.model = ECGData;

exports.save = function(data, callback) {
    ECGData.insertMany(data).then(() => callback());
}

