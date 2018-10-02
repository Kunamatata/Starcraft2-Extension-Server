const axios = require('axios');

const currentSeason = 'api.battle.net/data/sc2/season/current';
const currentLadder = 'api.battle.net/data/sc2/league';
const ladderEndpoint = 'api.battle.net/data/sc2/ladder';
module.exports = {
  getCurrentSeason(accessToken, params) {
    const { origin } = params;
    console.log(`https://${origin}.${currentSeason}?access_token=${accessToken}`);
    return axios.get(`https://${origin}.${currentSeason}?access_token=${accessToken}`);
  },
  ladder(accessToken, params) {
    const {
      season_id,
      queue_id,
      team_type,
      league_id,
      origin,
    } = params;
    console.log(`https://${origin}.${currentLadder}/${season_id}/${queue_id}/${team_type}/${league_id}?access_token=${accessToken}`);
    return axios.get(`https://${origin}.${currentLadder}/${season_id}/${queue_id}/${team_type}/${league_id}?access_token=${accessToken}`);
  },
  getLadder(accessToken, params) {
    const { origin, ladder_id } = params;
    console.log(`https://${origin}.${ladderEndpoint}/${ladder_id}`);
    return axios.get(`https://${origin}.${ladderEndpoint}/${ladder_id}?access_token=${accessToken}`);
  },
};
