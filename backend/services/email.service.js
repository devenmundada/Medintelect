const { google } = require('googleapis');
const oauth2Client = require('../config/google/googleAuth');

const gmail = google.gmail({
  version: 'v1',
  auth: oauth2Client
});

function makeEmail(to, subject, message) {
  const str = [
    `To: ${to}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${subject}`,
    '',
    message
  ].join('\n');

  return Buffer.from(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
}

async function sendEmail(to, subject, message) {
  const raw = makeEmail(to, subject, message);

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw }
  });
}

module.exports = { sendEmail };
