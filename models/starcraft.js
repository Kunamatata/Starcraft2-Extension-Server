'use strict'

const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const db_name = "starcraft2extension"

mongoose.Promise = global.Promise

var mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL ? process.env.OPENSHIFT_MONGODB_DB_URL + db_name : 'mongodb://127.0.0.1:27017/' + db_name;
// if(process.env.OPENSHIFT_MONGODB_DB_URL)
//     mongoURI = `${process.env.OPENSHIFT_MONGODB_DB_USERNAME}:${process.env.OPENSHIFT_MONGODB_DB_PASSWORD}@${}`
if (process.env.OPENSHIFT_MONGODB_DB_URL)
  mongoose.connect(process.env.OPENSHIFT_MONGODB_DB_URL + "kuna")
else
  mongoURL = 'mongodb://127.0.0.1:27017/' + db_name



var starcraftSchema = mongoose.Schema({
  content: {
    type: String,
    default: ""
  }
})

starcraftSchema.plugin(timestamp)

const Starcraft = mongoose.model('Starcraft', starcraftSchema)

module.exports = Starcraft