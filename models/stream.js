const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

mongoose.Promise = global.Promise;

const streamSchema = mongoose.Schema({
  content: {
    type: String,
    default: '',
  },
});

streamSchema.plugin(timestamp);

module.exports = mongoose.model('stream', streamSchema);
