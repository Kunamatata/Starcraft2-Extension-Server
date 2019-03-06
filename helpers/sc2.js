const axios = require('axios');
const CONSTANTS = require('../libs/blizzard-data');

const currentSeason = 'api.blizzard.com/sc2/ladder/season';
const currentLadder = 'api.blizzard.com/data/sc2/league';
const ladderEndpoint = 'api.blizzard.com/data/sc2/ladder';

module.exports = {
  getCurrentSeason(accessToken, params) {
    const { origin } = params;
    const regionId = CONSTANTS.regions[origin];

    console.log(`https://${origin}.${currentSeason}/${regionId}?access_token=${accessToken}`);
    return axios.get(`https://${origin}.${currentSeason}/${regionId}?access_token=${accessToken}`);
  },
  ladder(accessToken, params) {
    const {
      seasonId,
      queueId,
      teamType,
      leagueId,
      origin,
    } = params;
    console.log(`https://${origin}.${currentLadder}/${seasonId}/${queueId}/${teamType}/${leagueId}?access_token=${accessToken}`);
    return axios.get(`https://${origin}.${currentLadder}/${seasonId}/${queueId}/${teamType}/${leagueId}?access_token=${accessToken}`);
  },
  getLadder(accessToken, params) {
    const { origin, ladderId } = params;
    console.log(`https://${origin}.${ladderEndpoint}/${ladderId}`);
    return axios.get(`https://${origin}.${ladderEndpoint}/${ladderId}?access_token=${accessToken}`);
  },
};
