const mongoose = require('../connect_nosql')

const MacMapping = mongoose.model('MacMapping', {
    user_id: { type: 'ObjectId', ref: 'User' },
    device_id: Number,
    mac: String,
})

exports.model = MacMapping;

exports.addmapping = function(map_info,callback){
    MacMapping.insertMany(map_info).then(() => callback());
}

exports.findByUserId = function (user_id, callback) {
    MacMapping.find({ user_id }, callback);
}