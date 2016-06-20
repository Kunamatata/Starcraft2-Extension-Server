'use strict'

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const env = process.env

const app = express();

const mongoose = require("mongoose");
const StarcraftTwitchAPI = require('./controllers/Starcraft2TwitchController')

app.get('/', function(req, res) {
  res.send('Twitch API for Starcraft 2!');
});

app.get('/api/sc2/streams', StarcraftTwitchAPI.getTwitchData)

app.get('/health', function(req, res) {
  console.log("hello world")
})

app.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function() {
  console.log(`Application worker ${process.pid} started...`);
});

setInterval(StarcraftTwitchAPI.twitchSC2Worker, 20000)