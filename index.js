

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const helmet = require('helmet');

const app = express();

const StarcraftTwitchAPI = require('./controllers/Starcraft2TwitchController');

app.use(helmet());
app.use(favicon(path.join(__dirname, 'public/images', 'bg-1.jpg')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

app.use(express.static('public', { maxAge: 30000 }));

app.get('/api/sc2/streams', StarcraftTwitchAPI.getTwitchData);

app.get('/health', (req, res) => {
  console.log('hello world');
});

app.get('/api/status', (req, res) => {
  res.send(200, 'API is working');
});

setInterval(StarcraftTwitchAPI.twitchSC2Worker, 20000);
