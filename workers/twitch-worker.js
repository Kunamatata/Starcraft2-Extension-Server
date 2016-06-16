'use strict'

var fetch = require('node-fetch');

module.exports = class StarcraftTwitchAPI {
  static getTwitchData() {
    var starcraft2URL = 'https://api.twitch.tv/kraken/streams?game=StarCraft+II&limit=100';
    fetch(starcraft2URL).then(function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }
      response.json().then(function(res) {
        // store in redis or mongo db
      })
    })
  }
}