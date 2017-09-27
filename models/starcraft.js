'use strict'

const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

mongoose.Promise = global.Promise

var mongoURL = process.env.MONGO_URL ? process.env.MONGO_URL : "mongodb://127.0.0.1:27017/starcraft-db"

mongoose.connect(process.env.MONGO_URL, {
    useMongoClient: true
})

var starcraftSchema = mongoose.Schema({
    content: {
        type: String,
        default: ""
    }
})

starcraftSchema.plugin(timestamp)

const Starcraft = mongoose.model('Starcraft', starcraftSchema)
module.exports = Starcraft