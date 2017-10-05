require('dotenv').config();

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const helmet = require('helmet');
const compression = require('compression');
const responseTime = require('response-time');

const DatabaseManager = require('./config/DatabaseManager');
const StarcraftTwitchAPI = require('./controllers/Starcraft2TwitchController');

const databaseManager = new DatabaseManager();
const starcraftTwitchApi = new StarcraftTwitchAPI();
const app = express();

databaseManager.connect().then((values) => {
  console.log('Connections established!')
}).catch((err) => {
  console.log(`Oh no, there was an error connecting to the databases! Quick fix it: ${err}`);
})

starcraftTwitchApi.init({ databaseManager }).then(() =>{
  starcraftTwitchApi.start();
}).catch((err) => {
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
