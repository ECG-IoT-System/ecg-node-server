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
exports.find = function(data, callback) {
    var id = data.params.id;
    var from = data.query.from;
    var to = data.query.to;
    console.log(id + ' ' + from +' ' + to);
    ECGData.find({"user_id":id},function(err,ecgdata){
        //,'timestamp':{$gt:from},'timestamp':{$lt:to}
        if(err) console.log('err'+ err);
        callback(err,ecgdata);
    })
}
