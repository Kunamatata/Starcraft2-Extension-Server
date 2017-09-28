require('dotenv').config();
const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

mongoose.Promise = global.Promise;

console.log(`MONGOURLDEV= ${process.env.MONGO_URL_DEV}`);
console.log(`MONGOURL(openshift)= ${process.env.MONGO_URL}`);

const mongoURL = process.env.MONGO_URL_DEV ? process.env.MONGO_URL_DEV : process.env.MONGO_URL;

console.log(`mongoURL=${mongoURL}`);

mongoose.connect(mongoURL, {
  useMongoClient: true,
});

const streamSchema = mongoose.Schema({
  content: {
    type: String,
    default: '',
  },
});

streamSchema.plugin(timestamp);

module.exports = mongoose.model('stream', streamSchema);
