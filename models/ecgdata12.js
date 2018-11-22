const mongoose = require('../connect_nosql')

const ECGData12 = mongoose.model('ECGData12', {
    user_id: { type: 'ObjectId', ref: 'User' },
    time: Number,
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