const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const doctorsRoutes = require('./routes/doctors.routes');
const authRoutes = require('./routes/auth.routes');
const indianHospitalsRoutes = require('./routes/indian-hospitals.routes');
const aiAssistantRoutes = require('./routes/ai-assistant.routes');  
const appointmentRoutes = require('./routes/appointments.routes');
const googleRoutes = require('./routes/google.routes');

const app = express();
// Ensure we use a valid HTTP port, not a database port
let PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
// Safety check: if PORT is a common database port, use default
if (PORT === 5432 || PORT === 3306 || PORT === 27017) {
  console.warn(`⚠️  Warning: PORT ${PORT} is typically used for databases. Using 3001 instead.`);
  PORT = 3001;
}

// Middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// API Routes - MUST be before 404 handler
app.use('/api/auth', authRoutes);
console.log('✅ Auth routes registered at /api/auth');
console.log('✅ Doctors routes registered at /api/doctors');
console.log('✅ Indian hospitals routes registered at /api/india/hospitals');   
app.use('/api/india/hospitals', indianHospitalsRoutes);
app.use('/api/doctors', doctorsRoutes);
app.use('/api/ai', aiAssistantRoutes);
app.use('/api', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/google', googleRoutes);
// Test
app.get('/api/test', (req, res) => {
  res.json({ message: 'API working' });
});

// 404 handler - MUST be last
app.use('*', (req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: 'Route not found',
    method: req.method,
    path: req.originalUrl,
    hint: 'Make sure you are using the correct HTTP method (POST for /api/auth/signup)'
  });
});


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/auth/signup`);
  console.log(`   POST http://localhost:${PORT}/api/auth/login`);
  console.log(`🔗 API test: http://localhost:${PORT}/api/test`);
});