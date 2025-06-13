const express = require('express');
const passport = require('passport');

const router = express.Router();

// Step 1: Redirect user to Google for login
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Step 2: Google redirects back here after login
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
    session: true
  }),
  (req, res) => {
    // Successful login — redirect to Swagger UI or a success page
    res.redirect('/api-docs'); 
  }
);

// Optional: Logout route
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;