require('dotenv').config();

const redisClient = require('redis');
const mongoose = require('mongoose');
const StreamModel = require('../models/stream');
const PlayerModel = require('../models/player');

class DatabaseManager {
  constructor() {
    this.redis = null;
    this.mongoURL = process.env.MONGO_URL;
    this.streamModel = StreamModel;
    this.playerModel = PlayerModel;
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
    this.redis.setex('streams', 60, data);
  }

  deleteDocuments(date) {
    this.streamModel.findOne({
      createdAt: {
        $lt: date,
      },
    }).remove().exec();
  }

  savePlayerDocument(playerArray) {
    playerArray.forEach((element) => {
      const player = new PlayerModel({
        name: element.name,
        server: element.server,
        mmr: element.mmr,
        race: element.race,
        wins: element.wins,
        losses: element.loses,
      });
      this.playerModel.findOneAndUpdate({ name: element.name, server: element.server, race: element.race }, element, { new: true, upsert: true }, (data) => {});
      this.redis.set('players', JSON.stringify(element));
    });
  }

  getPlayerDocuments(name, server = null, race = null) {
    console.log(name, server, race);
    return new Promise((resolve, reject) => {
      this.redis.get(name, (err, result) => {
        let data;
        if (result) {
          data = JSON.parse(result);
          console.log(data);
          return resolve(data);
        }
        console.log('lookup database');
        this.playerModel.find({ name, race: race || /.*/, server: server || /.*/ }).lean().sort({
          createdAt: -1,
        }).exec()
          .then((results) => {
            if (results) {
              return resolve(results);
            }
            return resolve({ msg: 'No data stored' });
          });
      });
    });
  }

  saveBlizzardPlayerDocument(playerArray, origin) {
    const server = /[uU][sS]/.test(origin) ? 'NA' : 'EU';
    this.playerModel.find({ server: new RegExp(server, 'i') }).remove().exec();

    const players = playerArray.map(player => ({
      server,
      name: player.member[0].legacy_link.name,
      mmr: player.rating,
      race: player.member[0].played_race_count[0].race.en_US,
      wins: player.wins,
      losses: player.losses,
      currentRank: player.current_rank,
      previousRank: player.previousRank,
      lastPlayedDate: player.last_played_time_stamp * 1000,
    }));

    players.forEach((player) => {
      const p = new PlayerModel(player);
      p.save();
    });

    this.redis.set(`players-${origin}`, JSON.stringify(players));
    this.redis.expire(`players-${origin}`, 60);
  }

  getBlizzardPlayerDocuments(origin) {
    return new Promise((resolve, reject) => {
      this.redis.get(`players-${origin}`, (err, result) => {
        console.log(`player-${origin}`);
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
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
