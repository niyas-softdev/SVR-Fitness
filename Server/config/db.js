const mongoose = require('mongoose');
require('dotenv').config();

// Log the correct variable to check if it's loaded properly
console.log('MONGODB_URL:', process.env.MONGODB_URL);

mongoose.connect(process.env.MONGODB_URL, {
  dbName: process.env.DB_NAME,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to database');
  })
  .catch((err) => {
    console.log('Error connecting to database:', err);
  });
