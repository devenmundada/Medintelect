const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

class GoogleCalendarService {
  constructor() {
    this.auth = null;
    this.calendar = null;
    this.initialized = false;
    this.initialize();
  }

  async initialize() {
    try {
      console.log('🔧 Initializing Google Calendar Service...');
      
      // Try to load service account credentials
      const credentialPaths = [
        path.join(process.cwd(), 'service-account.json'),
        path.join(process.cwd(), 'config', 'google', 'service-account.json'),
        path.join(__dirname, '..', 'config', 'google', 'service-account.json'),
        process.env.GOOGLE_APPLICATION_CREDENTIALS
      ].filter(p => p);

      let credentials = null;
      
      for (const credPath of credentialPaths) {
        if (credPath && fs.existsSync(credPath)) {
          console.log(`📁 Found credentials at: ${credPath}`);
          try {
            credentials = JSON.parse(fs.readFileSync(credPath, 'utf8'));
            break;
          } catch (e) {
            console.warn(`⚠️ Could not read ${credPath}:`, e.message);
          }
        }
      }

      if (credentials) {
        // Initialize with Service Account
        this.auth = new google.auth.GoogleAuth({
          credentials: credentials,
          scopes: [
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events'
          ]
        });
        
        this.calendar = google.calendar({ version: 'v3', auth: this.auth });
        this.initialized = true;
        console.log('✅ Google Calendar Service initialized (Service Account)');
      } else {
        console.warn('⚠️ No Google credentials found. Running in MOCK mode.');
        console.warn('   To enable real Google Calendar:');
        console.warn('   1. Download service account JSON from Google Cloud Console');
        console.warn("   2. Save it as 'service-account.json' in your backend/ directory");
        console.warn('   3. Or set GOOGLE_APPLICATION_CREDENTIALS env variable');
      }
    } catch (error) {
      console.error('❌ Failed to initialize Google Calendar:', error && error.message ? error.message : error);
      this.initialized = false;
    }
  }

  // Main function to create calendar event with Meet link
  async createCalendarEvent(eventData) {
    try {
      const {
        summary,
        description,
        startTime,
        endTime,
        attendees = [],
        location = ''
      } = eventData;

      // If not initialized or credentials missing, use mock
      if (!this.initialized || !this.calendar) {
        console.log('📝 Creating mock calendar event (no credentials)');
        return this.createMockEvent(eventData);
      }

      console.log('📅 Creating REAL Google Calendar event...');
      
      const event = {
        summary: summary || 'Healthcare+ Appointment',
        description: description || 'Medical consultation',
        start: {
          me: startTime,
          timeZone: 'Asia/Kolkata',
        },
        end: {
          dateTime: endTime,
          timeZone: 'Asia/Kolkata',
        },
        attendees: attendees.map(email => ({ 
          email,
          responseStatus: 'needsAction'
        })),
        location: location,
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' }
          }
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 day before
            { method: 'popup', minutes: 30 } // 30 minutes before
          ]
        },
        colorId: '5' // Yellow color for appointments
      };

      console.log('📤 Sending request to Google Calendar API...');
      
      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        confenceDataVersion: 1,
        sendUpdates: 'all' // This sends email invites to attendees
      });

      const meetLink = response.data.hangoutLink || 
                      response.data.conferenceData?.entryPoints?.[0]?.uri ||
                      `https://meet.google.com/${response.data.conferenceData?.conferenceId}`;

      console.log('✅ REAL Google Calendar Event Created!');
      console.log('   Event ID:', response.data.id);
      console.log('   Meet Link:', meetLink);
      console.log('   HTML Link:', response.data.htmlLink);

      return {
        eventId: response.data.id,
        meetLink: meetLink,
        htmlLink: response.data.htmlLink,
        status: 'created',
        isReal: true,
        conferenceId: response.data.conferenceData?.conferenceId
      };

    } catch (error) {
      console.error('❌ Google Calendar API Error:', error.message);
      if (error.response?.data) {
        console.error('Error details:', JSON.stringify(error.response.data, null, 2));
      }
      consoog('📝 Falling back to mock event');
      return this.createMockEvent(eventData);
    }
  }

  // Mock event for when credentials are not available
  createMockEvent(eventData) {
    console.log('📝 Creating MOCK calendar event');
    
    // Generate realistic Google Meet-like link
    const prefix = ['abc', 'def', 'ghi', 'jkl', 'mno', 'pqr', 'stu', 'vwx', 'yz'][Math.floor(Math.random() * 9)];
    const middle = ['quick', 'smart', 'fast', 'clear'][Math.floor(Math.random() * 4)];
    const suffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    const meetLink = `https://meet.google.com/${prefix}-${middle}-${suffix}`;
    
    return {
      eventId: `mock-event-${Date.now()}`,
      meetLink: meetLink,
      htmlLink: '#',
      status: 'mock',
      isReal: false,
      message: 'Mock event. Add Google credentials for real Calendar integration.'
    };
  }

  // Keep the old generateGoogleMeetLink for backward compatibility
  static async generateGoogleMeetLink() {
    const ince = new GoogleCalendarService();
    const mockEvent = instance.createMockEvent({});
    return mockEvent.meetLink;
  }
}

// Create and export singleton instance
const googleCalendarService = new GoogleCalendarService();

// Export functions
module.exports = {
  GoogleCalendarService,
  googleCalendarService,
  createCalendarEvent: (eventData) => googleCalendarService.createCalendarEvent(eventData),
  generateGoogleMeetLink: GoogleCalendarService.generateGoogleMeetLink
};
