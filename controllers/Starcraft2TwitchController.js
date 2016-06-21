'use strict'

var fetch = require('node-fetch')
var Starcraft = require('../models/starcraft')
module.exports = class StarcraftTwitchAPI {

  static deleteOldDocuments(date) {
    Starcraft.find({
      createdAt: {
        $lt: date
      }
    }).remove().exec()
  }

  static twitchSC2Worker() {
    var starcraft2URL = 'https://api.twitch.tv/kraken/streams?game=StarCraft+II&limit=100';
    fetch(starcraft2URL).then(function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }
      console.log(response.status)
      response.json().then(function(response) {
        var lteDate = new Date()
        var starcraft = new Starcraft({
          content: JSON.stringify(response)
        })
        starcraft.save()
          // Remove the old documents always keep the most recent
        StarcraftTwitchAPI.deleteOldDocuments(new Date())
      })
    })
  }

  static getTwitchData(req, res) {
    console.log("getting data from mongo")
    Starcraft.findOne({}).sort({
      createdAt: -1
    }).exec().then(function(data) {
      res.send(JSON.parse(data.content))
    })
  }

}