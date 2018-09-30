const axios = require('axios');
const starcraft = require('./sc2');

const { BLIZZARD_CLIENT_ID, BLIZZARD_CLIENT_SECRET } = process.env;
const oauth_url = `battle.net/oauth/token?grant_type=client_credentials&client_id=${BLIZZARD_CLIENT_ID}&client_secret=${BLIZZARD_CLIENT_SECRET}`;

class Blizzard {
  constructor() {
    this.access_token = null;
    this.expires_in = null;
    this.access_token = null;
    this.sc2 = starcraft;
  }

  fetchToken(origin) {
    return new Promise((resolve, reject) => {
      axios.get(`https://${origin}.${oauth_url}`).then((response) => {
        const result = {
          access_token: response.data.access_token,
          expires_in: response.data.expires_in * 1000,
        };

        this.access_token = result.access_token;
        this.expires_in = Date.now() + result.expires_in;
        return resolve(result);
      });
    });
  }

  refreshToken() {
    if (this.isTokenExpired()) {
      this.fetchToken();
    }
  }

  isTokenExpired() {
    if (Date.now() > this.expires_in) {
      return true;
    }
    return false;
  }
}

module.exports = Blizzard;
