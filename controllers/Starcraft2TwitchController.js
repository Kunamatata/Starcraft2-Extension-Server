require('dotenv').config();

const fetch = require('node-fetch');
const { EventEmitter } = require('events');

module.exports = class StarcraftTwitchAPI extends EventEmitter {
  constructor() {
    super();
    this.starcraft2URL =
      'https://api.twitch.tv/helix/streams?game_id=490422&first=100';
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
    fetch(this.starcraft2URL, {
      headers: { 'Client-ID': process.env.TWITCH_CLIENT_ID }
    }).then(response => {
      if (response.status !== 200) {
        console.log(
          `Looks like there was a problem. Status Code: ${response.status}`
        );
        return;
      }
      response.json().then(jsonData => {
        const userQuery = jsonData.data.map(stream => {
          return `id=${stream.user_id}`;
        });
        fetch(`https://api.twitch.tv/helix/users?${userQuery.join(`&`)}`, {
          headers: { 'Client-ID': process.env.TWITCH_CLIENT_ID }
        }).then(res => {
          res.json().then(userResult => {
            const expandedStreams = jsonData.data.map((stream, index) => {
              const { profile_image_url, description } = userResult.data[index];
              return { ...stream, profile_image_url, description };
            });
            // console.log('updating database');
            this.databaseManager.saveDocument({ data: expandedStreams });
            // Remove the old documents always keep the most recent
            this.databaseManager.deleteDocuments(new Date());
          });
        });
      });
    });
  }

  getTwitchData(req, res) {
    const { lang } = req.query;
    return this.databaseManager.getDocuments('streams', lang).then(data => {
      res.json(data);
    });
  }
};
