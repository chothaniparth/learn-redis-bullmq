// redisClient.js
const { Queue, Worker } = require('bullmq');
const IORedis = require('ioredis');

// ✅ Add this config
const connection = new IORedis({
  host: 'localhost',         // or your Redis host
  port: 6379,                // default Redis port
  maxRetriesPerRequest: null // ⬅️ Required by BullMQ
});

const notificationQueue = new Queue('notifications', { connection });

module.exports = {
  connection,
  notificationQueue,
};
