// notificationWorker.js
const { Worker } = require('bullmq');
const { connection } = require('./redisClient.js');
const Sheduler = require('../models/shedule');
const { default: mongoose } = require('mongoose');
require('dotenv').config()

new Worker('notifications', async (job) => {
  const { messageId } = job.data;
  console.log('###########\n#############\n ########\n');
  
  await mongoose.connect(process.env.MONGODB_URI);
  const message = await Sheduler.find();
  console.log('Scheduled job is running...');
  console.log('message :', message);
}, {
  connection,
  // Add error logger
  onFailed: (job, err) => {
    console.error('Job failed:', job, err);
  }
});

