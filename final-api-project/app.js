require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const { connectToDatabase } = require('./db/connect');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');

require('./middleware/auth'); // Google OAuth strategy

const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const reviewRoutes = require('./routes/reviews');

const app = express();

app.use(cors());
app.use(express.json());

// Session and Passport Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'yourSecretKeyHere',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints related to Google OAuth login and logout
 */

//console.log('Swagger paths being loaded:', Object.keys(swaggerSpec.paths));
// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Login via Google OAuth
 *     description: Redirects user to Google for authentication
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to Google OAuth consent screen
 */
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     description: Handles Google OAuth response and creates session
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Login success
 *       401:
 *         description: Unauthorized
 */
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.json({
      message: 'Logged in via Google',
      user: req.user.displayName,
      email: req.user.emails?.[0]?.value || 'Not provided',
    });
  }
);

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Logout user
 *     description: Ends session and logs out the user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
app.get('/logout', (req, res) => {
  req.logout(() => {
    res.send('Logged out');
  });
});

// Middleware to protect routes
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).send('Unauthorized');
}

// Test protected route
app.get('/protected', isLoggedIn, (req, res) => {
  res.send(`Welcome, ${req.user.displayName}!`);
});

// Protected API routes
app.use('/api/orders', isLoggedIn, orderRoutes);
app.use('/api/users', isLoggedIn, userRoutes);
app.use('/api/products', isLoggedIn, productRoutes);
app.use('/api/reviews', isLoggedIn, reviewRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('API is running');
});

// MongoDB connection
connectToDatabase().catch((err) => {
  console.error('MongoDB connection failed:', err);
});

module.exports = app;