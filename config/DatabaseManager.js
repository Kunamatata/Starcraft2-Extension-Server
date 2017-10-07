require('dotenv').config();

const redisClient = require('redis');
const mongoose = require('mongoose');
const StreamModel = require('../models/stream');

class DatabaseManager {
  constructor() {
    this.redis = null;
    this.mongoURL = process.env.MONGO_URL;
    this.streamModel = StreamModel;
  }

  connectRedis() {
    return new Promise((resolve, reject) => {
      this.redis = redisClient.createClient(6379, process.env.REDIS);

      this.redis.once('connect', (data) => {
        console.log('Redis connection established. :D');
        return resolve();
      });

      this.redis.once('error', err => reject(new Error('err')));
    });
  }

  connectMongo() {
    return mongoose.connect(this.mongoURL, {
      useMongoClient: true,
    }).then(() => {
      console.log('Mongo connection establised.');
    });
  }

  connect() {
    return Promise.all([this.connectRedis(), this.connectMongo()]);
  }

  saveDocument(document) {
    const data = JSON.stringify(document);
    const streams = new StreamModel({
      content: data,
    });
    streams.save();
    this.redis.set('streams', data);
  }

  deleteDocuments(date) {
    this.streamModel.findOne({
      createdAt: {
        $lt: date,
      },
    }).remove().exec();
  }

  getDocuments(name, lang = null) {
    return new Promise((resolve, reject) => {
      this.redis.get(name, (err, result) => {
        let data;

        if (result) {
          data = JSON.parse(result);

          if (lang) {
            data.streams = data.streams.filter(el => el.channel.broadcaster_language === lang);
          }

          return resolve(data);
        }

        this.streamModel.findOne({}).lean().sort({
            createdAt: -1,
          }).exec()
          .then((results) => {
            if (results) {
              data = JSON.parse(results);

              if (lang) {
                data.streams = data.streams.filter(el => el.channel.broadcaster_language === lang);
              }

              return resolve(data);
            }
            return resolve({ msg: 'No data stored' });
          });
      });
    });
  }
}

module.exports = DatabaseManager;