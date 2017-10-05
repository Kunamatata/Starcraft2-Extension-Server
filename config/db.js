const mongoose = require('mongoose');
const redisClient = require('redis');

const mongoURL = process.env.MONGO_URL_DEV ? process.env.MONGO_URL_DEV : process.env.MONGO_URL;

// Connect to MongoDB
mongoose.connect(mongoURL, {
  useMongoClient: true,
}).then(() => {
  console.log('MongoDB connection established.');
});

// Connect to Redis
const redis = redisClient.createClient(6379, 'localhost');
redis.on('connect', (data) => {
  console.log('Redis connection established.');
});

redis.on('error', (err) => {
  console.log(err);
});

module.exports = {
  redis,
  mongoose,
};
