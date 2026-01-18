const { google } = require('googleapis');
const oauth2Client = require('../config/google/googleAuth');

const calendar = google.calendar({
  version: 'v3',
  auth: oauth2Client
});

async function createAppointment({ summary, description, start, end }) {
  const event = {
    summary,
    description,
    start: { dateTime: start },
    end: { dateTime: end }
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    resource: event
  });

  return response.data;
}

module.exports = { createAppointment };
