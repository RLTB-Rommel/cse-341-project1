const express = require('express');
const cors = require('cors');
const { connectToDatabase } = require('./db/connect');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');

const itemRoutes = require('./routes/items');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth'); 
const verifyToken = require('./middleware/verifyToken');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Auth route (no token needed)
app.use('/api/auth', authRoutes);

// Protected routes (token required)
app.use('/api/items', verifyToken, itemRoutes);
app.use('/api/users', verifyToken, userRoutes);

app.get('/', (req, res) => {
  res.send('API is running');
});

connectToDatabase().catch(err => {
  console.error('MongoDB connection failed:', err);
});

module.exports = app;