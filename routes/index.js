const express = require('express');
const router = express.Router();

const contactRoutes = require('./contacts');
const seedRoutes = require('./seed');

// Route forwarding
router.use('/contacts', contactRoutes);
router.use('/seed', seedRoutes);

// Optional base test route
router.get('/', (req, res) => {
  res.send('API Home');
});

module.exports = router;