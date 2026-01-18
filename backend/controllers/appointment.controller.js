const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const { generateGoogleMeetLink } = require('../services/google-calendar.service');

class AppointmentController {
  // Book new appointment
  static async bookAppointment(req, res) {
    try {
      const {
        doctor_id,
        scheduled_for,
        type = 'video',
        duration_minutes = 30,
        reason,
        symptoms,
        hospital_name,
        hospital_address
      } = req.body;

      const user_id = req.user.id; // From auth middleware

      // Validate required fields
      if (!doctor_id || !scheduled_for) {
        return res.status(400).json({
          success: false,
          message: 'Doctor ID and appointment time are required'
        });
      }

      // Check if doctor exists
      const doctor = await Doctor.findById(doctor_id);
      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: 'Doctor not found'
        });
      }

      // Check doctor availability
      const isAvailable = await Appointment.checkDoctorAvailability(
        doctor_id,
        scheduled_for,
        duration_minutes
      );

      if (!isAvailable) {
        return res.status(400).json({
          success: false,
          message: 'Doctor is not available at this time. Please choose another time slot.'
        });
      }

      // Generate Google Meet link for video consultations
      let meeting_link = null;
      let google_event_id = null;
      let calendar_event = null;
      
      if (type === 'video') {
        try {
          // Create real Google Calendar event with Meet
          const { createCalendarEvent } = require('../services/google-calendar.service');
          
          calendar_event = await createCalendarEvent({
            summary: `Appointment with Dr. ${doctor.name}`,
            description: `Medical consultation with Dr. ${doctor.name}\nSpecialty: ${doctor.specialty}\nReason: ${reason || 'General checkup'}\nPatient: ${req.user.email}`,
            startTime: scheduled_for,
            endTime: new Date(new Date(scheduled_for).getTime() + duration_minutes * 60000).toISOString(),
            attendees: [req.user.email, doctor.email].filter(Boolean),
            location: 'Google Meet'
          });
      
          meeting_link = calendar_event.meetLink;
          google_event_id = calendar_event.eventId;
          
          console.log('✅ Google Calendar event created:', calendar_event);
        } catch (error) {
          console.error('❌ Google Calendar error:', error);
          // Fallback to mock link
          const { generateGoogleMeetLink } = require('../services/google-calendar.service');
          meeting_link = await generateGoogleMeetLink();
        }
      }

      // Create appointment
      const appointmentData = {
        user_id,
        doctor_id,
        type,
        scheduled_for: new Date(scheduled_for),
        duration_minutes,
        reason: reason || '',
        symptoms: symptoms || '',
        meeting_link,
        hospital_name: hospital_name || doctor.hospital_name,
        hospital_address: hospital_address || doctor.hospital_address
      };

      const appointment = await Appointment.create(appointmentData);

      // TODO: Send confirmation email/notification
      // TODO: Add to Google Calendar

      res.status(201).json({
        success: true,
        message: 'Appointment booked successfully',
        data: appointment
      });

    } catch (error) {
      console.error('Error booking appointment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to book appointment',
        error: error.message
      });
    }
  }

  // Get user's appointments
  static async getUserAppointments(req, res) {
    try {
      const userId = req.user.id;
      const appointments = await Appointment.findByUserId(userId);

      res.json({
        success: true,
        data: appointments
      });
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch appointments'
      });
    }
  }

  // Cancel appointment
  static async cancelAppointment(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // In production, verify user owns the appointment
      const appointment = await Appointment.cancel(id);

      // TODO: Send cancellation email
      // TODO: Remove from Google Calendar

      res.json({
        success: true,
        message: 'Appointment cancelled successfully',
        data: appointment
      });
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to cancel appointment'
      });
    }
  }

  // Get doctor availability for a date
  static async getDoctorAvailability(req, res) {
    try {
      const { doctorId } = req.params;
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({
          success: false,
          message: 'Date is required'
        });
      }

      // Get doctor's working hours from doctor_availability table
      const availabilityQuery = `
        SELECT day_of_week, start_time, end_time
        FROM doctor_availability
        WHERE doctor_id = $1 AND is_available = true
      `;
      
      // Get existing appointments for that day
      const appointments = await Appointment.getDoctorAvailableSlots(doctorId, date);

      // Generate available time slots
      // This is simplified - you'd implement proper slot generation
      const availableSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00',
        '11:30', '14:00', '14:30', '15:00', '15:30',
        '16:00', '16:30'
      ];

      res.json({
        success: true,
        data: {
          available_slots: availableSlots,
          existing_appointments: appointments
        }
      });

    } catch (error) {
      console.error('Error fetching doctor availability:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch doctor availability'
      });
    }
  }
}

module.exports = AppointmentController;