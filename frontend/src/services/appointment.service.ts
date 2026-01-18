import { api } from './api';

export interface AppointmentBookingData {
  doctor_id: number;
  scheduled_for: string; // ISO date string
  type: 'video' | 'in-person';
  duration_minutes?: number;
  reason?: string;
  symptoms?: string;
  hospital_name?: string;
  hospital_address?: string;
}

export interface Appointment {
  id: number;
  user_id: number;
  doctor_id: number;
  type: 'video' | 'in-person';
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  scheduled_for: string;
  duration_minutes: number;
  reason: string;
  symptoms: string;
  meeting_link: string | null;
  hospital_name: string | null;
  hospital_address: string | null;
  doctor_name?: string;
  doctor_specialty?: string;
  doctor_image?: string;
  consultation_fee?: number;
  created_at: string;
  updated_at: string;
}

export interface AppointmentResponse {
  success: boolean;
  message: string;
  data: Appointment;
}

export interface DoctorAvailability {
  available_slots: string[];
  existing_appointments: string[];
}

const AppointmentService = {
  // Book new appointment
  async bookAppointment(data: AppointmentBookingData): Promise<AppointmentResponse> {
    try {
      const response = await api.post('/appointments/book', data);
      return response.data;
    } catch (error: any) {
      console.error('Error booking appointment:', error);
      throw new Error(error.response?.data?.message || 'Failed to book appointment');
    }
  },

  // Get user's appointments
  async getUserAppointments(): Promise<{ success: boolean; data: Appointment[] }> {
    try {
      const response = await api.get('/appointments/my-appointments');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching appointments:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch appointments');
    }
  },

  // Cancel appointment
  async cancelAppointment(appointmentId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.put(`/appointments/${appointmentId}/cancel`);
      return response.data;
    } catch (error: any) {
      console.error('Error cancelling appointment:', error);
      throw new Error(error.response?.data?.message || 'Failed to cancel appointment');
    }
  },

  // Get doctor availability for a date
  async getDoctorAvailability(doctorId: number, date: string): Promise<{ success: boolean; data: DoctorAvailability }> {
    try {
      const response = await api.get(`/doctors/${doctorId}/availability?date=${date}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching doctor availability:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch doctor availability');
    }
  },

  // Generate Google Meet link (mock for now, will connect to backend)
  async generateGoogleMeetLink(): Promise<string> {
    // For now, generate mock link
    // In production, this would call backend which calls Google API
    const adjectives = ['quick', 'smart', 'fast', 'clear', 'bright'];
    const nouns = ['fox', 'bear', 'eagle', 'lion', 'tiger'];
    
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum = Math.floor(Math.random() * 1000);
    
    return `https://meet.google.com/${randomAdjective}-${randomNoun}-${randomNum}`;
  }
};

export default AppointmentService;