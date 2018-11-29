const mongoose = require('../connect_nosql');


const Coef = mongoose.model('Coef', {
    user_id: { type: 'ObjectId', ref: 'User' },
    version:Number,
    description:String,
    F: String,
    K: String,
    HH: String,
});
exports.model = Coef;

exports.save = function(data, callback) {
    //var newCoef = new Coef(data);
    //newCoef.save().then(() => callback());
    Coef.insertMany(data).then(() => callback());
}
exports.find_all_byuserid = function(id,callback){
    Coef.find({user_id:id},function(err,coef){
        if(err) console.log('err'+ err);
        callback(err,coef);
    })
}

exports.find_all_coefs = function(callback) {
    var pipeline =[
        {"$lookup":{from:"users",localField:"user_id",foreignField:"_id",as:"user_info"}},
        {"$unwind":"$user_info"}, 
        {"$project": {"username":"$user_info.username","version":1,"description":1,"F":1,"K":1,"HH":1}}
    ]
    Coef.aggregate(pipeline).then(callback)
}