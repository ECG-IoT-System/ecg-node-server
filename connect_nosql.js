const mongoose = require('mongoose');

let url = process.env.MONGO_URL || 'mongodb://localhost/test';
mongoose.connect(url, { useNewUrlParser: true });

module.exports = mongoose;
