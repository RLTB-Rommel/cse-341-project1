const express = require('express');
const cors = require('cors');
const { connectToDatabase } = require('./db/connect');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger'); 
const itemRoutes = require('./routes/items'); 
const userRoutes = require('./routes/users');  
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mount your routes
app.use('/api/items', itemRoutes);
app.use('/api/users', userRoutes); 

app.get('/', (req, res) => {
  res.send('API is running');
});

connectToDatabase().catch(err => {
  console.error('MongoDB connection failed:', err);
});

module.exports = app;