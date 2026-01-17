import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Video, 
  User, 
  MapPin, 
  CheckCircle,
  Building,
  Stethoscope,
  AlertCircle,
  Loader2,
  Navigation,
  Phone,
  Mail,
  Globe
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Badge } from '../../ui/Badge';

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Hospital {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  specialties: string[];
  latitude: number;
  longitude: number;
  phone: string;
  website: string;
}

const AppointmentBookingModal: React.FC<AppointmentBookingModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [consultationType, setConsultationType] = useState<'video' | 'in-person'>('video');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [nearbyHospitals, setNearbyHospitals] = useState<Hospital[]>([]);
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    email: '',
    phone: '',
    reason: ''
  });

  const doctors = [
    { id: 1, name: 'Dr. Sarah Chen', specialization: 'Cardiology', available: ['2024-01-20', '2024-01-21'] },
    { id: 2, name: 'Dr. Michael Rodriguez', specialization: 'Neurology', available: ['2024-01-20'] },
    { id: 3, name: 'Dr. Emma Johnson', specialization: 'Pediatrics', available: ['2024-01-22', '2024-01-23'] },
  ];

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
  ];

  // Get user location when in-person consultation is selected
  useEffect(() => {
    if (isOpen && consultationType === 'in-person' && step >= 2) {
      getUserLocation();
    }
  }, [isOpen, consultationType, step]);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        fetchNearbyHospitals(latitude, longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to get your location. Using demo hospitals.");
        setNearbyHospitals(getMockHospitals());
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  const fetchNearbyHospitals = async (lat: number, lng: number) => {
    try {
      // In production, call your backend API which calls Google Places API
      // For demo, using mock data
      const hospitals = getMockHospitals(lat, lng);
      setNearbyHospitals(hospitals);
      
      // Auto-select the nearest hospital
      if (hospitals.length > 0) {
        setSelectedHospital(hospitals[0]);
      }
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      setNearbyHospitals(getMockHospitals(lat, lng));
    } finally {
      setLoadingLocation(false);
    }
  };

  const getMockHospitals = (lat?: number, lng?: number): Hospital[] => [
    {
      id: '1',
      name: 'City General Hospital',
      address: '123 Medical Center Dr, San Francisco, CA 94107',
      distance: '0.5 miles',
      rating: 4.8,
      specialties: ['Emergency Care', 'Cardiology', 'General Surgery'],
      latitude: lat ? lat + 0.001 : 37.7749,
      longitude: lng ? lng + 0.001 : -122.4194,
      phone: '(555) 123-4567',
      website: 'https://citygeneral.example.com'
    },
    {
      id: '2',
      name: 'Westside Medical Center',
      address: '456 Health Ave, San Francisco, CA 94103',
      distance: '1.2 miles',
      rating: 4.6,
      specialties: ['Pediatrics', 'Dermatology', 'Orthopedics'],
      latitude: lat ? lat + 0.002 : 37.7729,
      longitude: lng ? lng + 0.002 : -122.4174,
      phone: '(555) 234-5678',
      website: 'https://westsidemedical.example.com'
    },
    {
      id: '3',
      name: 'University Hospital',
      address: '789 Campus Rd, San Francisco, CA 94117',
      distance: '2.3 miles',
      rating: 4.9,
      specialties: ['Neurology', 'Oncology', 'Research Center'],
      latitude: lat ? lat - 0.002 : 37.7769,
      longitude: lng ? lng - 0.002 : -122.4214,
      phone: '(555) 345-6789',
      website: 'https://universityhospital.example.com'
    },
    {
      id: '4',
      name: 'Community Health Clinic',
      address: '101 Wellness St, San Francisco, CA 94110',
      distance: '0.8 miles',
      rating: 4.5,
      specialties: ['Family Medicine', 'Mental Health', 'Preventive Care'],
      latitude: lat ? lat + 0.0015 : 37.7759,
      longitude: lng ? lng - 0.0015 : -122.4184,
      phone: '(555) 456-7890',
      website: 'https://communityclinic.example.com'
    }
  ];

  const generateGoogleMeetLink = () => {
    // In production, this would call Google Calendar API to create event
    // For demo, generate a mock Google Meet link
    const meetingId = Math.random().toString(36).substring(2, 15);
    return `https://meet.google.com/${meetingId}`;
  };

  const openGoogleMapsDirections = (hospital: Hospital) => {
    if (!userLocation) return;
    
    const origin = `${userLocation.lat},${userLocation.lng}`;
    const destination = `${hospital.latitude},${hospital.longitude}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const handleSubmit = async () => {
    try {
      if (consultationType === 'video') {
        // Generate Google Meet link
        const meetLink = generateGoogleMeetLink();
        
        // Create Google Calendar event (mock implementation)
        const calendarEvent = {
          title: `Appointment with ${selectedDoctor?.name}`,
          description: `Reason: ${patientInfo.reason}\nMeet Link: ${meetLink}`,
          startTime: `${selectedDate}T${selectedTime}`,
          endTime: `${selectedDate}T${selectedTime}`,
        };
        
        alert(`✅ Appointment booked successfully!\n\n📅 Added to Google Calendar\n🔗 Google Meet: ${meetLink}\n📧 Confirmation sent to: ${patientInfo.email}\n\nThe Google Meet link will be active 15 minutes before your appointment.`);
        
      } else if (consultationType === 'in-person' && selectedHospital) {
        // Generate Google Maps link
        const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedHospital.address)}`;
        
        alert(`✅ Appointment booked successfully!\n\n🏥 Hospital: ${selectedHospital.name}\n📍 Address: ${selectedHospital.address}\n📞 Phone: ${selectedHospital.phone}\n🗺️ Directions: ${mapsLink}\n\nPlease arrive 15 minutes early for check-in.`);
      }
      
      // Reset and close
      onClose();
      setStep(1);
      setSelectedDoctor(null);
      setSelectedDate('');
      setSelectedTime('');
      setPatientInfo({ name: '', email: '', phone: '', reason: '' });
      
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-neutral-800 p-6 border-b border-neutral-200 dark:border-neutral-700 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="w-6 h-6 text-primary-600 mr-3" />
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  Book Appointment
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Progress Steps */}
            <div className="flex items-center justify-between mt-6">
              {[1, 2, 3, 4].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= stepNum 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500'
                  }`}>
                    {step > stepNum ? <CheckCircle className="w-5 h-5" /> : stepNum}
                  </div>
                  <div className={`ml-2 text-sm ${step >= stepNum ? 'font-medium' : 'text-neutral-500'}`}>
                    {stepNum === 1 && 'Select Doctor'}
                    {stepNum === 2 && 'Choose Time'}
                    {stepNum === 3 && 'Details'}
                    {stepNum === 4 && 'Confirm'}
                  </div>
                  {stepNum < 4 && (
                    <div className={`ml-2 w-12 h-0.5 ${step > stepNum ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 1 && (
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                  Select Doctor or Specialty
                </h3>
                <div className="space-y-4">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      onClick={() => {
                        setSelectedDoctor(doctor);
                        setStep(2);
                      }}
                      className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-primary-500 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-4">
                            <User className="w-6 h-6 text-primary-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-neutral-900 dark:text-white">
                              {doctor.name}
                            </h4>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                              {doctor.specialization}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">Available</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                  Select Date & Time
                </h3>
                <div className="space-y-6">
                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Available Dates
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedDoctor?.available.map((date: string) => (
                        <button
                          key={date}
                          onClick={() => setSelectedDate(date)}
                          className={`p-3 rounded-lg border transition-colors ${
                            selectedDate === date
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                              : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-300'
                          }`}
                        >
                          <div className="text-center">
                            <div className="font-medium">
                              {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                            </div>
                            <div className="text-2xl font-bold">
                              {new Date(date).getDate()}
                            </div>
                            <div className="text-xs text-neutral-500">
                              {new Date(date).toLocaleDateString('en-US', { month: 'short' })}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Slots */}
                  {selectedDate && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Available Time Slots
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`p-3 rounded-lg border transition-colors ${
                              selectedTime === time
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-300'
                            }`}
                          >
                            <div className="flex items-center justify-center">
                              <Clock className="w-4 h-4 mr-2" />
                              {time}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Consultation Type */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Consultation Type
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => setConsultationType('video')}
                        className={`p-4 border rounded-lg text-center transition-colors ${
                          consultationType === 'video'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-neutral-200 dark:border-neutral-700 hover:border-blue-300'
                        }`}
                      >
                        <Video className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                        <div className="font-medium">Video Consultation</div>
                        <div className="text-sm text-neutral-500">Google Meet Link</div>
                        {consultationType === 'video' && (
                          <div className="mt-2 text-xs text-blue-600">✅ Selected</div>
                        )}
                      </button>
                      
                      <button 
                        onClick={() => setConsultationType('in-person')}
                        className={`p-4 border rounded-lg text-center transition-colors ${
                          consultationType === 'in-person'
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'border-neutral-200 dark:border-neutral-700 hover:border-green-300'
                        }`}
                      >
                        <MapPin className="w-6 h-6 mx-auto mb-2 text-green-500" />
                        <div className="font-medium">In-Person Visit</div>
                        <div className="text-sm text-neutral-500">Clinic/Hospital</div>
                        {consultationType === 'in-person' && (
                          <div className="mt-2 text-xs text-green-600">✅ Selected</div>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Show nearby hospitals for in-person consultation */}
                  {consultationType === 'in-person' && selectedDate && selectedTime && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        {loadingLocation ? 'Finding hospitals near you...' : 'Nearby Hospitals'}
                      </label>
                      
                      {loadingLocation ? (
                        <div className="text-center py-4">
                          <Loader2 className="w-8 h-8 mx-auto mb-2 text-primary-600 animate-spin" />
                          <p className="text-sm text-neutral-500">Getting your location...</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {nearbyHospitals.map((hospital) => (
                            <div
                              key={hospital.id}
                              onClick={() => setSelectedHospital(hospital)}
                              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                selectedHospital?.id === hospital.id
                                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                  : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-300'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center mb-2">
                                    <Building className="w-5 h-5 text-primary-600 mr-2" />
                                    <h4 className="font-medium text-neutral-900 dark:text-white">
                                      {hospital.name}
                                    </h4>
                                  </div>
                                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                                    {hospital.address}
                                  </p>
                                  <div className="flex items-center space-x-4 text-xs">
                                    <span className="flex items-center">
                                      <Navigation className="w-3 h-3 mr-1" />
                                      {hospital.distance} away
                                    </span>
                                    <span>⭐ {hospital.rating}/5</span>
                                    <span className="text-primary-600">
                                      {hospital.specialties.slice(0, 2).join(', ')}
                                    </span>
                                  </div>
                                </div>
                                {selectedHospital?.id === hospital.id && (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                )}
                              </div>
                              
                              {selectedHospital?.id === hospital.id && (
                                <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                                  <div className="flex items-center space-x-4">
                                    <a 
                                      href={`tel:${hospital.phone}`}
                                      className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                                    >
                                      <Phone className="w-4 h-4 mr-1" />
                                      Call
                                    </a>
                                    <a 
                                      href={hospital.website}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                                    >
                                      <Globe className="w-4 h-4 mr-1" />
                                      Website
                                    </a>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openGoogleMapsDirections(hospital);
                                      }}
                                      className="flex items-center text-sm text-green-600 hover:text-green-700"
                                    >
                                      <Navigation className="w-4 h-4 mr-1" />
                                      Directions
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                  Patient Information
                </h3>
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    placeholder="John Smith"
                    value={patientInfo.name}
                    onChange={(e) => setPatientInfo({...patientInfo, name: e.target.value})}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    value={patientInfo.email}
                    onChange={(e) => setPatientInfo({...patientInfo, email: e.target.value})}
                    required
                  />
                  <Input
                    label="Phone Number"
                    placeholder="+1 (555) 123-4567"
                    value={patientInfo.phone}
                    onChange={(e) => setPatientInfo({...patientInfo, phone: e.target.value})}
                  />
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Reason for Visit
                    </label>
                    <textarea
                      value={patientInfo.reason}
                      onChange={(e) => setPatientInfo({...patientInfo, reason: e.target.value})}
                      placeholder="Briefly describe your symptoms or concerns..."
                      className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg px-4 py-2 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[100px]"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">
                  Confirm Appointment Details
                </h3>
                
                <div className="space-y-6">
                  {/* Summary Card */}
                  <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-neutral-600 dark:text-neutral-400">Doctor</span>
                        <span className="font-medium">{selectedDoctor?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600 dark:text-neutral-400">Specialization</span>
                        <span className="font-medium">{selectedDoctor?.specialization}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600 dark:text-neutral-400">Date & Time</span>
                        <span className="font-medium">
                          {new Date(selectedDate).toLocaleDateString()} at {selectedTime}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600 dark:text-neutral-400">Patient</span>
                        <span className="font-medium">{patientInfo.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600 dark:text-neutral-400">Consultation Type</span>
                        <Badge variant={consultationType === 'video' ? 'outline' : 'success'}>
                          {consultationType === 'video' ? 'Video Consultation' : 'In-Person Visit'}
                        </Badge>
                      </div>
                      
                      {consultationType === 'in-person' && selectedHospital && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-neutral-600 dark:text-neutral-400">Hospital</span>
                            <span className="font-medium text-right">{selectedHospital.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-600 dark:text-neutral-400">Address</span>
                            <span className="font-medium text-right text-sm">{selectedHospital.address}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-600 dark:text-neutral-400">Distance</span>
                            <span className="font-medium">{selectedHospital.distance}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Features based on consultation type */}
                  <div className="space-y-3">
                    {consultationType === 'video' ? (
                      <>
                        <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <Video className="w-5 h-5 text-blue-500 mr-3" />
                          <div className="flex-1">
                            <span className="text-sm font-medium">Google Meet Link</span>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400">
                              {generateGoogleMeetLink()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <Calendar className="w-5 h-5 text-green-500 mr-3" />
                          <span className="text-sm">Google Calendar event will be created</span>
                        </div>
                        <div className="flex items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <Mail className="w-5 h-5 text-purple-500 mr-3" />
                          <span className="text-sm">Meet link will be emailed to {patientInfo.email}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <Navigation className="w-5 h-5 text-green-500 mr-3" />
                          <span className="text-sm">Google Maps directions available</span>
                        </div>
                        <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <Phone className="w-5 h-5 text-blue-500 mr-3" />
                          <span className="text-sm">Hospital contact: {selectedHospital?.phone}</span>
                        </div>
                        <div className="flex items-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                          <AlertCircle className="w-5 h-5 text-amber-500 mr-3" />
                          <span className="text-sm">Please arrive 15 minutes early for check-in</span>
                        </div>
                      </>
                    )}
                    
                    <div className="flex items-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-amber-500 mr-3" />
                      <span className="text-sm">Reminders sent 24h and 1h before appointment</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-white dark:bg-neutral-800 p-6 border-t border-neutral-200 dark:border-neutral-700 rounded-b-2xl">
            <div className="flex justify-between">
              {step > 1 && (
                <Button variant="ghost" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              )}
              
              <div className="ml-auto flex space-x-3">
                {step < 4 ? (
                  <Button
                    onClick={() => setStep(step + 1)}
                    disabled={
                      (step === 1 && !selectedDoctor) ||
                      (step === 2 && (!selectedDate || !selectedTime || 
                        (consultationType === 'in-person' && !selectedHospital))) ||
                      (step === 3 && (!patientInfo.name || !patientInfo.email))
                    }
                  >
                    Continue
                  </Button>
                ) : (
                  <Button onClick={handleSubmit}>
                    Confirm & Book Appointment
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBookingModal;