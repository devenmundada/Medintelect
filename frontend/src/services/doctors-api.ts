import { api } from './api';

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  qualification: string[];
  experience_years: number;
  hospital_id?: number;
  hospital_name?: string;
  hospital_city?: string;
  hospital_state?: string;
  consultation_fee: number;
  available_days: string[];
  available_hours: string;
  languages: string[];
  rating: number;
  review_count: number;
  patient_count: number;
  phone: string;
  email: string;
  bio: string;
  profile_image_url: string;
  is_verified: boolean;
}

export interface DoctorsResponse {
  success: boolean;
  data: Doctor[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface DoctorSearchParams {
  specialty?: string;
  city?: string;
  minExperience?: number;
  maxFee?: number;
  limit?: number;
  offset?: number;
}

const DoctorsAPI = {
  // Get all doctors with filters
  async getDoctors(params: DoctorSearchParams = {}): Promise<DoctorsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.specialty) queryParams.append('specialty', params.specialty);
    if (params.city) queryParams.append('city', params.city);
    if (params.minExperience) queryParams.append('minExperience', params.minExperience.toString());
    if (params.maxFee) queryParams.append('maxFee', params.maxFee.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());
    
    const queryString = queryParams.toString();
    const url = `/doctors${queryString ? `?${queryString}` : ''}`;
    
    try {
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }
  },

  // Search doctors
  async searchDoctors(query: string): Promise<Doctor[]> {
    try {
      const response = await api.get(`/doctors/search?q=${encodeURIComponent(query)}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error searching doctors:', error);
      return [];
    }
  },

  // Get doctor by ID
  async getDoctorById(id: number): Promise<Doctor | null> {
    try {
      const response = await api.get(`/doctors/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching doctor:', error);
      return null;
    }
  },

  // Get all specialties
  async getSpecialties(): Promise<string[]> {
    try {
      const response = await api.get('/doctors/specialties');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching specialties:', error);
      return [];
    }
  },

  // Get top rated doctors
  async getTopRatedDoctors(limit: number = 6): Promise<Doctor[]> {
    try {
      const response = await api.get(`/doctors/top-rated?limit=${limit}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching top rated doctors:', error);
      return [];
    }
  },

  // Get doctors by specialty
  async getDoctorsBySpecialty(specialty: string): Promise<Doctor[]> {
    try {
      const response = await api.get(`/doctors/specialty/${encodeURIComponent(specialty)}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching doctors by specialty:', error);
      return [];
    }
  },
};

export default DoctorsAPI;