require('dotenv').config();

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const helmet = require('helmet');
const compression = require('compression');
const responseTime = require('response-time');

const StarcraftTwitchAPI = require('./controllers/Starcraft2TwitchController');

const app = express();

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

app.get('/api/sc2/streams', StarcraftTwitchAPI.getTwitchData);

setInterval(StarcraftTwitchAPI.twitchSC2Worker, 20000);
