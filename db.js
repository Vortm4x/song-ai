//db.js
const mongoose = require('mongoose');

const username = 'maksym_trehubenko'
const password = 'RWeg5P88JpXB4cqJ'
const database = 'song-ai'
const cluster = 'yigbdqs.mongodb.net'
const URI = `mongodb+srv://${username}:${password}@${database}.${cluster}/?retryWrites=true&w=majority`

const connectDB = async () => {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
};

module.exports = connectDB;