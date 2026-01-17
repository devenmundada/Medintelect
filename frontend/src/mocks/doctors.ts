import { Doctor } from '../types/medical.types';

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    specialty: 'Cardiology',
    hospital: 'Mayo Clinic',
    experience: 15,
    rating: 4.9,
    consultations: 1247,
    isOnline: true,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  },
  {
    id: '2',
    name: 'Dr. Michael Rodriguez',
    specialty: 'Radiology',
    hospital: 'Johns Hopkins',
    experience: 12,
    rating: 4.8,
    consultations: 987,
    isOnline: true,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
  },
  {
    id: '3',
    name: 'Dr. James Wilson',
    specialty: 'Oncology',
    hospital: 'Cleveland Clinic',
    experience: 20,
    rating: 4.9,
    consultations: 1563,
    isOnline: false,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James'
  },
  {
    id: '4',
    name: 'Dr. Emma Johnson',
    specialty: 'Pediatrics',
    hospital: 'Boston Children\'s',
    experience: 8,
    rating: 4.7,
    consultations: 643,
    isOnline: true,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma'
  },
  {
    id: '5',
    name: 'Dr. David Kim',
    specialty: 'Neurology',
    hospital: 'Mass General',
    experience: 14,
    rating: 4.8,
    consultations: 1124,
    isOnline: true,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David'
  }
];

export const leaderboardDoctors = [...mockDoctors]
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 5);