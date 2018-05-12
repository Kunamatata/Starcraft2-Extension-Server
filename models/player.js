const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

mongoose.Promise = global.Promise;

const playerSchema = mongoose.Schema({
  name: {
    type: String,
    default: '',
  },
  server: {
    type: String,
    default: '',
  },
  mmr: {
    type: Number,
    default: '',
  },
  wins: {
    type: Number,
    default: 0,
  },
  losses: {
    type: Number,
    default: 0,
  },
  race: {
    type: String,
    default: '',
  },
});

playerSchema.plugin(timestamp);

module.exports = mongoose.model('player', playerSchema);
