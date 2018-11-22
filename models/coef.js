const mongoose = require('../connect_nosql');


const Coef = mongoose.model('Coef', {
    user_id: { type: 'ObjectId', ref: 'User' },
    version:Number,
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
