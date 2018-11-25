const mongoose = require('../connect_nosql')

const Gsensor = mongoose.model('Gsensor', {
    user_id: { type: 'ObjectId', ref: 'User' },
    device_id: Number,
    axisX: Number,
    axisY: Number,
    axisZ: Number,
    timestamp: Number,
});

exports.model = Gsensor;

exports.save = function(data, callback) {
    Gsensor.insertMany(data).then(() => callback());
}