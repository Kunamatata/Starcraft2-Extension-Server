require('dotenv').config();

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const helmet = require('helmet');
const compression = require('compression');
const responseTime = require('response-time');

const DatabaseManager = require('./config/DatabaseManager');
const TwitchOauth = require('./helpers/twitch-oauth');

const oauth = new TwitchOauth();
oauth.init();

const StarcraftTwitchAPI = require('./controllers/Starcraft2TwitchController');
const Sc2UnmaskedController = require('./controllers/Sc2UnmaskedController');

const databaseManager = new DatabaseManager();
const starcraftTwitchApi = new StarcraftTwitchAPI();
const sc2UnmaskedController = new Sc2UnmaskedController();

const Blizzard = require('./helpers/blizzard');
const Starcraft = require('./helpers/sc2');

const blizzard = new Blizzard();
// blizzard.fetchToken('us');
blizzard.fetchToken('eu');

const app = express();

databaseManager.connect().then((values) => {
  console.log('Connections established!');
}).catch((err) => {
  console.log(`Oh no, there was an error connecting to the databases! Quick fix it: ${err}`);
});

starcraftTwitchApi.init({ databaseManager }).then(() => {
  starcraftTwitchApi.start();
}).catch((err) => {
  console.log(`Oh no, there was an error! Quick fix it: ${err}`);
  process.exit(1);
});

// sc2UnmaskedController.init({ databaseManager }).then(() => {

// }).catch((err) => {
//   console.log(`Oh no, there was an error! Quick fix it: ${err}`);
//   process.exit(1);
// });

app.use(helmet());
app.use(compression());
app.use(responseTime());

app.use(favicon(path.join(__dirname, 'public/img', 'bg-1.jpg')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.static('public', { maxAge: 30000 }));

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

app.get('/api/status', (req, res) => {
  res.status(200).send({ msg: 'API is working' });
});

app.get('/api/sc2/streams', (req, res) => starcraftTwitchApi.getTwitchData(req, res));

// app.get('/api/sc2/players', (req, res) => {
//   sc2UnmaskedController.getUnmaskedData(req, res);
// });

app.get('/api/sc2/players/:origin', (req, res) => {
  const { origin } = req.params;

  databaseManager.getBlizzardPlayerDocuments(origin).then((data) => {
    console.log('Fetching from redis');
    if (data) {
      return res.send(data);
    }

    Starcraft.getCurrentSeason(blizzard.access_token, { origin }).then((response) => {
      const season_id = response.data.id;
      Starcraft.ladder(blizzard.access_token, {
        season_id,
        queue_id: 201,
        team_type: 0,
        league_id: 6,
        origin,
      }).then((response) => {
        const ladder_id = response.data.tier[0].division[0].ladder_id;
        Starcraft.getLadder(blizzard.access_token, { origin, ladder_id })
          .then((response) => {
            databaseManager.saveBlizzardPlayerDocument(response.data.team, origin);
            databaseManager.getBlizzardPlayerDocuments(origin).then((data) => {
              res.send(data);
            });
          });
      });
    }).catch((e) => {
      blizzard.refreshToken();
      return res.sendStatus(200);
    });
  }).catch((e) => {
    console.log(e);
  });
});
