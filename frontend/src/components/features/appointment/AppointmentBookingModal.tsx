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
  Globe,
  Star,
  Award,
  Users,
  Heart
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Badge } from '../../ui/Badge';
import { Card } from '../../ui/Card';
import AppointmentService from '../../../services/appointment.service';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  consultationFee: number;
  hospital: {
    name: string;
    city: string;
  };
  schedule: {
    days: string[];
    hours: string;
  };
  availability: {
    online: boolean;
    inPerson: boolean;
  };
  photoUrl?: string;
  experience?: number;
  rating?: number;
  qualifications?: string[];
  languages?: string[];
}

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor;
}

interface Hospital {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  specialties: string[];
  phone: string;
  website: string;
}

const AppointmentBookingModal: React.FC<AppointmentBookingModalProps> = ({ 
  isOpen, 
  onClose,
  doctor 
}) => {
  const [step, setStep] = useState(1);
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
  const [isBooking, setIsBooking] = useState(false);

  // Mock time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30'
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
      // For demo, using mock data
      const hospitals = getMockHospitals();
      setNearbyHospitals(hospitals);
      
      // Auto-select the nearest hospital
      if (hospitals.length > 0) {
        setSelectedHospital(hospitals[0]);
      }
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      setNearbyHospitals(getMockHospitals());
    } finally {
      setLoadingLocation(false);
    }
  };

  const getMockHospitals = (): Hospital[] => [
    {
      id: '1',
      name: 'City General Hospital',
      address: '123 Medical Center Dr, Mumbai, MH 400001',
      distance: '0.5 miles',
      rating: 4.8,
      specialties: ['Emergency Care', 'Cardiology', 'General Surgery'],
      phone: '(022) 1234-5678',
      website: 'https://citygeneral.example.com'
    },
    {
      id: '2',
      name: 'Apollo Hospital',
      address: '456 Health Ave, Delhi, DL 110001',
      distance: '1.2 miles',
      rating: 4.6,
      specialties: ['Pediatrics', 'Dermatology', 'Orthopedics'],
      phone: '(011) 2345-6789',
      website: 'https://apollohospitals.com'
    },
    {
      id: '3',
      name: 'Fortis Hospital',
      address: '789 Care Street, Bangalore, KA 560001',
      distance: '2.5 miles',
      rating: 4.7,
      specialties: ['Neurology', 'Oncology', 'Cardiac Surgery'],
      phone: '(080) 3456-7890',
      website: 'https://fortishealthcare.com'
    },
  ];

  const handleSubmitBooking = async () => {
    try {
      if (!selectedDate || !selectedTime) {
        alert('Please select date and time');
        return;
      }

      setIsBooking(true);

      // Combine date and time
      const appointmentDateTime = new Date(`${selectedDate}T${selectedTime}:00`);
      
      const bookingData = {
        doctor_id: parseInt(doctor.id),
        scheduled_for: appointmentDateTime.toISOString(),
        type: consultationType,
        duration_minutes: 30,
        reason: patientInfo.reason || 'General Consultation',
        symptoms: '',
        hospital_name: consultationType === 'in-person' && selectedHospital 
          ? selectedHospital.name 
          : doctor.hospital?.name || 'Online Consultation',
        hospital_address: consultationType === 'in-person' && selectedHospital
          ? selectedHospital.address
          : `${doctor.hospital?.name || 'Online'}, ${doctor.hospital?.city || 'Virtual'}`
      };

      const response = await AppointmentService.bookAppointment(bookingData);
      
      if (response.success) {
        alert(`✅ Appointment booked successfully!\n\n` +
              `Doctor: ${doctor.name}\n` +
              `Date: ${selectedDate} at ${selectedTime}\n` +
              `Type: ${consultationType === 'video' ? 'Video Consultation' : 'In-Person'}\n` +
              (response.data.meeting_link ? `Google Meet Link: ${response.data.meeting_link}` : '') +
              `\n\nCheck your email for confirmation.`);
        
        onClose(); // Close modal
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      alert(`❌ Failed to book appointment: ${error.message}`);
    } finally {
      setIsBooking(false);
    }
  };

  // Generate dates for next 7 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip weekends (optional)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        const dateStr = date.toISOString().split('T')[0];
        const displayStr = date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        });
        dates.push({ value: dateStr, display: displayStr });
      }
    }
    return dates;
  };

  const dates = generateDates();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Book Appointment
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Step {step} of 3 • Complete your booking
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Doctor Information */}
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary-100 dark:border-primary-900/30">
                <img
                  src={doctor.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.name}`}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                      {doctor.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline">{doctor.specialization}</Badge>
                      {doctor.experience && (
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {doctor.experience} years experience
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">
                      ₹{doctor.consultationFee}
                    </div>
                    <div className="text-sm text-neutral-500">Consultation Fee</div>
                  </div>
                </div>
                
                {doctor.hospital && (
                  <div className="flex items-center mt-3 text-neutral-600 dark:text-neutral-400">
                    <Building className="w-4 h-4 mr-2" />
                    <span>{doctor.hospital.name}, {doctor.hospital.city}</span>
                  </div>
                )}
                
                {doctor.availability && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {doctor.availability.online && (
                      <Badge variant="outline" className="flex items-center">
                        <Video className="w-3 h-3 mr-1" />
                        Video Consult
                      </Badge>
                    )}
                    {doctor.availability.inPerson && (
                      <Badge variant="outline" className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        In-Person
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Step 1: Date & Time Selection */}
          {step === 1 && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                Select Date & Time
              </h3>
              
              {/* Date Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Select Date
                </label>
                <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
                  {dates.map((date) => (
                    <button
                      key={date.value}
                      onClick={() => setSelectedDate(date.value)}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        selectedDate === date.value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                      }`}
                    >
                      <div className="font-medium">{date.display.split(' ')[0]}</div>
                      <div className="text-lg font-bold">{date.display.split(' ')[2]}</div>
                      <div className="text-xs text-neutral-500">{date.display.split(' ')[1]}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Select Time Slot
                </label>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        selectedTime === time
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!selectedDate || !selectedTime}
                >
                  Next: Consultation Type
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Consultation Type */}
          {step === 2 && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                Consultation Type
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setConsultationType('video')}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    consultationType === 'video'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <div className={`p-2 rounded-lg ${
                      consultationType === 'video' 
                        ? 'bg-primary-100 dark:bg-primary-900/30' 
                        : 'bg-neutral-100 dark:bg-neutral-800'
                    }`}>
                      <Video className="w-6 h-6" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-lg mb-2">Video Consultation</h4>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-3">
                    Connect with doctor via secure video call from anywhere
                  </p>
                  <ul className="text-sm text-neutral-500 space-y-1">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Google Meet link provided
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      No travel required
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Prescription delivered digitally
                    </li>
                  </ul>
                </button>

                <button
                  onClick={() => setConsultationType('in-person')}
                  disabled={!doctor.availability?.inPerson}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    consultationType === 'in-person'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                  } ${!doctor.availability?.inPerson ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center mb-3">
                    <div className={`p-2 rounded-lg ${
                      consultationType === 'in-person' 
                        ? 'bg-primary-100 dark:bg-primary-900/30' 
                        : 'bg-neutral-100 dark:bg-neutral-800'
                    }`}>
                      <User className="w-6 h-6" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-lg mb-2">In-Person Visit</h4>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-3">
                    Visit doctor at hospital/clinic for physical examination
                  </p>
                  <ul className="text-sm text-neutral-500 space-y-1">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Physical examination possible
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Lab tests available on-site
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Immediate treatment if needed
                    </li>
                  </ul>
                </button>
              </div>

              {consultationType === 'in-person' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Select Hospital
                  </label>
                  {loadingLocation ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="w-6 h-6 animate-spin text-primary-500 mr-2" />
                      <span>Finding nearby hospitals...</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {nearbyHospitals.map((hospital) => (
                        <Card
                          key={hospital.id}
                          className={`p-4 cursor-pointer transition-all ${
                            selectedHospital?.id === hospital.id
                              ? 'ring-2 ring-primary-500'
                              : ''
                          }`}
                        >
                          <div 
                            className="flex items-center justify-between"
                            onClick={() => setSelectedHospital(hospital)}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => {
                              if (e.key === "Enter" || e.key === " ") setSelectedHospital(hospital);
                            }}
                          >
                            <div>
                              <h4 className="font-medium">{hospital.name}</h4>
                              <p className="text-sm text-neutral-500">{hospital.address}</p>
                              <div className="flex items-center mt-2 space-x-4">
                                <span className="flex items-center text-sm">
                                  <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                                  {hospital.rating}
                                </span>
                                <span className="text-sm">{hospital.distance} away</span>
                                <span className="text-sm">{hospital.phone}</span>
                              </div>
                            </div>
                            {selectedHospital?.id === hospital.id && (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="secondary" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)}>
                  Next: Patient Details
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Patient Details */}
          {step === 3 && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                Patient Information
              </h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Full Name
                  </label>
                  <Input
                    value={patientInfo.name}
                    onChange={(e) => setPatientInfo({...patientInfo, name: e.target.value})}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={patientInfo.email}
                      onChange={(e) => setPatientInfo({...patientInfo, email: e.target.value})}
                      placeholder="you@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Phone Number
                    </label>
                    <Input
                      value={patientInfo.phone}
                      onChange={(e) => setPatientInfo({...patientInfo, phone: e.target.value})}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Reason for Visit / Symptoms
                  </label>
                  <textarea
                    value={patientInfo.reason}
                    onChange={(e) => setPatientInfo({...patientInfo, reason: e.target.value})}
                    placeholder="Describe your symptoms or reason for consultation..."
                    className="w-full h-32 p-3 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Appointment Summary */}
              <Card className="p-4 mb-6 bg-neutral-50 dark:bg-neutral-800/50">
                <h4 className="font-semibold mb-3">Appointment Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Doctor:</span>
                    <span className="font-medium">{doctor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Date & Time:</span>
                    <span className="font-medium">
                      {selectedDate} at {selectedTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Consultation Type:</span>
                    <span className="font-medium">
                      {consultationType === 'video' ? 'Video Consultation' : 'In-Person Visit'}
                    </span>
                  </div>
                  {consultationType === 'in-person' && selectedHospital && (
                    <div className="flex justify-between">
                      <span className="text-neutral-600 dark:text-neutral-400">Hospital:</span>
                      <span className="font-medium">{selectedHospital.name}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-neutral-200 dark:border-neutral-700">
                    <span className="text-neutral-600 dark:text-neutral-400">Total Fee:</span>
                    <span className="text-lg font-bold text-primary-600">₹{doctor.consultationFee}</span>
                  </div>
                </div>
              </Card>

              <div className="flex justify-between">
                <Button variant="secondary" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  onClick={handleSubmitBooking}
                  disabled={isBooking || !patientInfo.name || !patientInfo.email || !patientInfo.phone}
                  leftIcon={isBooking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
                >
                  {isBooking ? 'Booking...' : 'Confirm Booking'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentBookingModal;