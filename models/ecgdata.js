const mongoose = require('../connect_nosql');

const ECGData = mongoose.model('ECGData', {
    user_id: { type: 'ObjectId', ref: 'User' },
    device_id: Number,
    data: Number,
    timestamp: Number,
    //tags: { timestamp: [Number], index: true }
});

exports.model = ECGData;

exports.save = function(data, callback) {
    ECGData.insertMany(data).then(callback);
}

//return sorted datas from t1 to t2
exports.find_intervalecg = function(id,from,to,callback) {
    // console.log('id:'+ id + ' from:' + from +' to:' + to);
    // ECGData.find({"user_id":id,'timestamp':{$gt:from},'timestamp':{$lt:to}},
    // ['device_id','timestamp','data'],{sort:{time:1}},function(err,ecgdata){
    //     if(err) console.log('err'+ err);
    //     callback(err,ecgdata);
    // })
    var query = ECGData.find({"user_id":id,'timestamp':{$gt:from,$lt:to}})
    //var query = ECGData.find({"user_id":id,'timestamp':{$gt:from},'timestamp':{$lt:to}})
    .select(['device_id','timestamp','data'])
    //.sort({time:1});
    query.exec(function(err,ecgdata){
        if(err) console.log('err'+ err);
        callback(err,ecgdata);
    })
}

//
exports.find_limitecg = function(id,from,limitation,callback) {
    var query = ECGData.find({"user_id":id,'timestamp':{$gt:from}})
    .select(['device_id','timestamp','data'])
    //.sort({time:1})
    .limit(Number(limitation));
    query.exec(function(err,ecgdata){
        //if(err) console.log('err'+ err);
        callback(err,ecgdata);
    })
}
