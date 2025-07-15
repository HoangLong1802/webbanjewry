//CLI: npm install mongoose --save
const mongoose = require('mongoose');
const MyConstants = require('./MyConstants');

// Use the MONGODB_URI from constants or build from components
const uri = MyConstants.MONGODB_URI || 'mongodb+srv://' + MyConstants.DB_USER + ':' + MyConstants.DB_PASS + '@' + MyConstants.DB_SERVER + '/' + MyConstants.DB_DATABASE;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => { console.log('Connected to MongoDB:', MyConstants.DB_DATABASE); })
  .catch((err) => { console.error('MongoDB connection error:', err); });