require('dotenv').config();

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const helmet = require('helmet');
const compression = require('compression');
const responseTime = require('response-time');
const logger = require('./config/winston');

const DatabaseManager = require('./config/DatabaseManager');
const TwitchOauth = require('./helpers/twitch-oauth');
const Blizzard = require('./helpers/blizzard');
const Starcraft = require('./helpers/sc2');

const oauth = new TwitchOauth();
oauth.init();

const StarcraftTwitchAPI = require('./controllers/Starcraft2TwitchController');

const databaseManager = new DatabaseManager();
const starcraftTwitchApi = new StarcraftTwitchAPI();

const blizzard = new Blizzard();
blizzard.fetchToken('eu');

const app = express();

databaseManager.connect().then((values) => {
  console.log('Connections established!');
}).catch((err) => {
  console.log(`Oh no, there was an error connecting to the databases! Quick fix it: ${err}`);
});

starcraftTwitchApi.init({ databaseManager }).catch((err) => {
  console.log(`Oh no, there was an error! Quick fix it: ${err}`);
  process.exit(1);
});

app.use(helmet());
app.use(compression());
app.use(responseTime());

app.use(favicon(path.join(__dirname, 'public/img', 'bg-1.jpg')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Cache-Control', 'max-age=20');
  next();
});

app.use(express.static(path.join(__dirname, 'public'),
  { maxAge: 60 * 60 * 1000 }));

app.use((req, res, next) => {
  logger.info(req.originalUrl, { ipAddr: req.ip });
  next();
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

app.get('/api/status', (req, res) => {
  res.status(200).send({ msg: 'API is working' });
});

app.get('/api/sc2/streams', (req, res) => starcraftTwitchApi.getTwitchData(req, res));

app.get('/api/sc2/players/:origin', (req, res) => {
  const { origin } = req.params;

  databaseManager.getBlizzardPlayerDocuments(origin).then((data) => {
    console.log('Fetching from redis');
    if (data) {
      return res.send(data);
    }

    Starcraft.getCurrentSeason(blizzard.access_token, { origin }).then((response) => {
      const { seasonId } = response.data;
      Starcraft.ladder(blizzard.access_token, {
        seasonId,
        queueId: 201,
        teamType: 0,
        leagueId: 6,
        origin,
      }).then((response) => {
        const ladderId = response.data.tier[0].division[0].ladder_id;
        Starcraft.getLadder(blizzard.access_token, { origin, ladderId })
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
