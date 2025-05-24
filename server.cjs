const express = require('express');
const app = express();
const { connectToDatabase } = require('./db/connect');
const routes = require('./routes'); // automatically loads routes/index.js

require('dotenv').config();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Use all routes from routes/index.js
app.use('/', routes);

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err);
  });