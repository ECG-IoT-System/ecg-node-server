const mongoose = require('../connect_nosql')

const ECGData12 = mongoose.model('ECGData12', {
    user_id: { type: 'ObjectId', ref: 'User' },
    timestamp: Number,
    L1: Number,
    L2: Number,
    L3: Number,
    V1: Number,
    V2: Number,
    V3: Number,
    V4: Number,
    V5: Number,
    V6: Number,
    aVR: Number,
    aVL: Number,
    aVF: Number,
});

exports.model = ECGData12;
exports.save = function(data, callback) {
    ECGData12.insertMany(data).then(() => callback());
}
//return sorted datas from t1 to t2
exports.find_intervalecg = function(id,from,to,callback) {
    var query = ECGData12.find({user_id:id,timestamp:{$gte:from,$lte:to}})
    .select(['timestamp','L1','L2','L3','V1','V2','V3','V4','V5','V6','aVR','aVL','aVF'])
    .sort({time:1});
    query.exec(function(err,ecgdata){
        if(err) console.log('err'+ err);
        callback(err,ecgdata);
    })
}

//
exports.find_limitecg = function(id,from,limitation,callback) {
    var query = ECGData12.find({user_id:id,timestamp:{$gte:Number(from)}})
    .select(['timestamp','L1','L2','L3','V1','V2','V3','V4','V5','V6','aVR','aVL','aVF'])
    .sort({time:1})
    .limit(Number(limitation));
    query.exec(function(err,ecgdata){
        //if(err) console.log('err'+ err);
        callback(err,ecgdata);
    })
}