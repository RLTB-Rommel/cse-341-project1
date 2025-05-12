require('dotenv').config();
console.log('MONGO_URI:', process.env.MONGO_URI);
const express = require('express');
const app = express();
const { connectToDatabase } = require('./db/connect');
const seedRoutes = require('./routes/seed');
const contactRoutes = require('./routes/contacts');

require('dotenv').config(); // Load .env variables

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/', seedRoutes);
app.use('/contacts',contactRoutes);

// Connect to MongoDB, then start the server
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err);
  });
