'use strict'

var fetch = require('node-fetch')
var StreamModel = require('../models/stream')

module.exports = class StarcraftTwitchAPI {
    static deleteOldDocuments(date) {
        StreamModel.find({
            createdAt: {
                $lt: date
            }
        }).remove().exec()
    }

    static getFavoriteChannels() {
        // TODO : Get favorite list of channels depending on the route params
    }

    static twitchSC2Worker() {
        var starcraft2URL = 'https://api.twitch.tv/kraken/streams?game=StarCraft+II&limit=100';
        fetch(starcraft2URL, { headers: { 'Client-Id': 'd70esgd3z7nrisyuznehtqp8l5a1qeu' } }).then(function(response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                return;
            }
            console.log(response.status)
            response.json().then(function(response) {
                var lteDate = new Date()
                var streams = new StreamModel({
                    content: JSON.stringify(response)
                })
                streams.save()
                    // Remove the old documents always keep the most recent
                StarcraftTwitchAPI.deleteOldDocuments(new Date())
            })
        })
    }

    static getTwitchData(req, res) {
        console.log("getting data from mongo")
        StreamModel.findOne({}).sort({
            createdAt: -1
        }).exec().then(function(data) {
            res.send(JSON.parse(data.content))
        })
    }

}