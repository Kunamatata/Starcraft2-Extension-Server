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
    default: 0,
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
  currentRank: {
    type: Number,
    default: 0,
  },
  previousRank: {
    type: Number,
    default: 0,
  },
  lastPlayedDate: {
    type: Number,
    default: 0,
  },
});

playerSchema.plugin(timestamp);

module.exports = mongoose.model('player', playerSchema);
