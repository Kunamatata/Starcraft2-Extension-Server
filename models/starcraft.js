'use strict'

const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const db_name = "starcraft2extension"
const mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL ? process.env.OPENSHIFT_MONGODB_DB_URL + db_name : 'mongodb://127.0.0.1:27017/' + db_name;

mongoose.connect(mongoURL)
mongoose.Promise = global.Promise

var starcraftSchema = mongoose.Schema({
  content: {
    type: String,
    default: ""
  }
})

starcraftSchema.plugin(timestamp)

const Starcraft = mongoose.model('Starcraft', starcraftSchema)

module.exports = Starcraft