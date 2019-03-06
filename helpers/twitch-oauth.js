const fetch = require('node-fetch');

const { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, TWITCH_GRANT_TYPE } = process.env;

class TwitchOauth {
  constructor() {
    this.oauthURL = `https://id.twitch.tv/oauth2/token?client_id=${TWITCH_CLIENT_ID}&client_secret=${TWITCH_CLIENT_SECRET}&grant_type=${TWITCH_GRANT_TYPE}`;
    this.access_token = null;
    this.expires_in = null;
    this.authHeader = {
      authorization: 'Authorization',
      bearer: 'Bearer ',
    };
  }

  init() {
    return new Promise((resolve, reject) => {
      fetch(this.oauthURL, { method: 'POST' }).then(response => response.json()).then((data) => {
        if (data == null || data.access_token === null) {
          reject(Error('oauth failed'));
        }
        this.access_token = data.access_token;
        this.expires_in = data.expires_in;
        this.authHeader.bearer += this.access_token;
        resolve();
      });
    });
  }
}

module.exports = TwitchOauth;
