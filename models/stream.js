'use strict'

require('dotenv').config()
const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

console.log("MONGOURLDEV= " + process.env.MONGO_URL_DEV)
console.log("MONGOURL(openshift)= " + process.env.MONGO_URL)
var mongoURL = process.env.MONGO_URL_DEV ? process.env.MONGO_URL_DEV : process.env.MONGO_URL

console.log("mongoURL=" + mongoURL)

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