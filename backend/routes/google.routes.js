const express = require('express');
const router = express.Router();
const oauth2Client = require('../config/google/googleAuth');
const scopes = require('../config/google/scopes');

// Step 1: Redirect user to Google
router.get('/auth', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });
  res.redirect(url);
});

// Step 2: Google callback
router.get('/callback', async (req, res) => {
  const { code } = req.query;

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // TODO: store tokens in DB (per user)
  console.log('Google Tokens:', tokens);

  res.redirect('http://localhost:3000/dashboard');
});

module.exports = router;
