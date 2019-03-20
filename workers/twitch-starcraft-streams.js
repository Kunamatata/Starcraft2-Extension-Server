
const DatabaseManager = require('../config/DatabaseManager');
const StarcraftTwitchAPI = require('../controllers/Starcraft2TwitchController');

const databaseManager = new DatabaseManager();
const starcraftTwitchApi = new StarcraftTwitchAPI();


databaseManager.connect().then(() => {
  console.log('Connections established!');
}).catch((err) => {
  console.log(`Oh no, there was an error connecting to the databases! Quick fix it: ${err}`);
});
/**
 * Start the pooling from the Twitch API and saves it to the database
 */
starcraftTwitchApi.init({ databaseManager }).then(() => {
  starcraftTwitchApi.start();
}).catch((err) => {
  console.log(`Oh no, there was an error! Quick fix it: ${err}`);
  process.exit(1);
});
