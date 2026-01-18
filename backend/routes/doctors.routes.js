const express = require('express');
const router = express.Router();
const doctorsController = require('../controllers/doctors.controller');
const AppointmentController = require('../controllers/appointment.controller');
const authMiddleware = require('../middlewear/auth.middleware');
const pool = require('../config/database');


// GET /api/doctors - Get all doctors with filters
router.get('/', doctorsController.getAllDoctors);

// GET /api/doctors/search - Search doctors
router.get('/search', doctorsController.searchDoctors);

// GET /api/doctors/top-rated - Get top rated doctors
router.get('/top-rated', doctorsController.getTopRatedDoctors);

// GET /api/doctors/specialties - Get all specialties
router.get('/specialties', doctorsController.getSpecialties);

// GET /api/doctors/specialty/:specialty - Get doctors by specialty
router.get('/specialty/:specialty', doctorsController.getDoctorsBySpecialty);

// GET /api/doctors/:id - Get doctor by ID
router.get('/:id', doctorsController.getDoctorById);

router.post('/:id/book', authMiddleware, AppointmentController.bookAppointment);
router.get('/:id/availability', AppointmentController.getDoctorAvailability);

router.post('/seed', async (req, res) => {
    try {
      await pool.query(`
        INSERT INTO doctors (name, specialty, experience, rating, mode)
        VALUES
        ('Dr. Ananya Sharma', 'Cardiology', 12, 4.8, 'Online'),
        ('Dr. Rohit Verma', 'Orthopedics', 8, 4.6, 'Offline'),
        ('Dr. Pooja Mehta', 'Dermatology', 6, 4.7, 'Online'),
        ('Dr. Arjun Patel', 'Neurology', 15, 4.9, 'Online'),
        ('Dr. Neha Kulkarni', 'General Physician', 5, 4.5, 'Emergency')
      `);
  
      res.json({ success: true, message: 'Doctors seeded successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Seeding failed' });
    }
  });

module.exports = router;