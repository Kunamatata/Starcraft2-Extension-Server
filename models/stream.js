'use strict'

require('dotenv').config()
const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

var mongoURL = process.env.MONGO_URL_DEV ? process.env.MONGO_URL_DEV : process.env.MONGO_URL

mongoose.connect(mongoURL, {
    useMongoClient: true
})

var streamSchema = mongoose.Schema({
    content: {
        type: String,
        default: ""
    }
})

streamSchema.plugin(timestamp)

module.exports = mongoose.model('stream', streamSchema)