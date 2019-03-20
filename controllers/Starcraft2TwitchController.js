require('dotenv').config();

const fetch = require('node-fetch');
const { EventEmitter } = require('events');

module.exports = class StarcraftTwitchAPI extends EventEmitter {
  constructor() {
    super();
    this.starcraft2URL = 'https://api.twitch.tv/kraken/streams?game=StarCraft+II&limit=100';
    this.intervalMS = null;
    this.poolingMS = 20000;
    this.databaseManager = null;
  }

  init(opt) {
    return new Promise((resolve, reject) => {
      const options = opt || {};

      if (options.databaseManager == null) {
        return reject(new Error('No database manager was given to initialize'));
      }

      this.databaseManager = options.databaseManager;
      return resolve();
    });
  }

  start() {
    this.interval = setInterval(() => {
      this.twitchSC2Worker();
    }, this.poolingMS);
  }

  twitchSC2Worker() {
    fetch(this.starcraft2URL, { headers: { 'Client-Id': process.env.CLIENT_ID } }).then((response) => {
      if (response.status !== 200) {
        console.log(`Looks like there was a problem. Status Code: ${response.status}`);
        return;
      }
      response.json().then((jsonData) => {
        // console.log('updating database');
        this.databaseManager.saveDocument(jsonData);
        // Remove the old documents always keep the most recent
        this.databaseManager.deleteDocuments(new Date());

        // deep diff on json to see if it changed - websocket idea
        // this.emit("emitted", {data: jsonData})
      });
    });
  }

  getTwitchData(req, res) {
    const { lang } = req.query;
    this.databaseManager.redis.get('streams', (err, result) => {
      if (result) {
        // console.log('returning from redis');
        return res.send(result);
      }
      return this.databaseManager.getDocuments('streams', lang).then((data) => {
        res.send(data);
      });
    });
  }
};
