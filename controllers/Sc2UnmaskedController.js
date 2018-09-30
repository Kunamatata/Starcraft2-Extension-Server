require('dotenv').config();

const fetch = require('node-fetch');
const { EventEmitter } = require('events');
const querystring = require('query-string');
const moment = require('moment');

module.exports = class Sc2UnmaskedController extends EventEmitter {
  constructor() {
    super();
    this.unmaskedPlayerAPI = 'http://sc2unmasked.com/API/Player';
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

  twitchSC2Worker() {
    fetch(this.starcraft2URL, { headers: { 'Client-Id': process.env.CLIENT_ID } }).then((response) => {
      if (response.status !== 200) {
        console.log(`Looks like there was a problem. Status Code: ${response.status}`);
        return;
      }
      response.json().then((jsonData) => {
        console.log('updating database');
        this.databaseManager.saveDocument(jsonData);
        // Remove the old documents always keep the most recent
        this.databaseManager.deleteDocuments(new Date());

        // deep diff on json to see if it changed - websocket idea
        // this.emit("emitted", {data: jsonData})
      });
    });
  }

  fetchUnmaskedData(name, server, race) {
    return new Promise((resolve, reject) => {
      const query = {
        q: name,
      };
      const url = `${this.unmaskedPlayerAPI}?${querystring.stringify(query)}`;
      console.log('fetching from api');
      fetch(url).then((response) => {
        if (response.status !== 200) {
          console.log(`Looks like there was a problem. Status Code: ${response.status}`);
          return;
        }
        response.json().then((jsonData) => {
          const { players } = jsonData;

          const playersArray = players.reduce((prev, curr) => {
            const player = {
              name: curr.acc_name,
              server: curr.server,
              mmr: curr.mmr,
              race: curr.race,
              wins: curr.wins,
              losses: curr.losses,
            };
            prev.push(player);
            return prev;
          }, []);

          this.databaseManager.savePlayerDocument(playersArray);
          this.databaseManager.getPlayerDocuments(name, server, race).then(data => resolve(data));
        });
      });
    });
  }

  getUnmaskedData(req, res) {
    const { name, server, race } = req.query;
    const now = moment();

    this.databaseManager.getPlayerDocuments(name, server, race).then((data) => {
      console.log('database data : ');
      console.log(data);
      if (data.length > 0) {
        if (now.diff(moment(data[0].updatedAt), 'seconds') > 60) {
          this.fetchUnmaskedData(name, server, race).then((player) => {
            res.send(player);
          });
        } else {
          return res.send(data);
        }
      } else if (data === null || data === undefined || data.length === 0) {
        this.fetchUnmaskedData(name).then((player) => {
          console.log(player);
          return res.send(player);
        });
      }
    });
  }
};
