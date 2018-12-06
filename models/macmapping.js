const mongoose = require('../connect_nosql')

const MacMapping = mongoose.model('MacMapping', {
    user_id: { type: 'ObjectId', ref: 'User' },
    device_id: Number,
    mac: String,
    description:String,
    status:Boolean,
})

exports.model = MacMapping;

exports.addmapping = function(map_info,callback){
    MacMapping.updateMany({mac:map_info.mac},{$set:{status:false}},function(err,result){
        //console.log(result);
        map_info.status = true;
        new MacMapping(map_info).save(callback);
    });
    
    //MacMapping.save()
    //MacMapping.insertMany(map_info).then(() => callback());
}

exports.findByUserId = function (user_id, callback) {
    MacMapping.find({ user_id }, callback);
}