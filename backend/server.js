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

/**
 * ✅ PORT handling (Railway-safe)
 */
let PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
if ([5432, 3306, 27017].includes(PORT)) {
  console.warn(`⚠️ PORT ${PORT} is a database port. Falling back to 3001.`);
  PORT = 3001;
}

/**
 * ✅ Middleware
 */
app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

/**
 * ✅ Health Check
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

/**
 * ✅ API Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorsRoutes);
app.use('/api/india/hospitals', indianHospitalsRoutes);
app.use('/api/ai', aiAssistantRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/google', googleRoutes);

/**
 * ✅ API Test
 */
app.get('/api/test', (req, res) => {
  res.json({ message: 'API working' });
});

/**
 * ✅ 404 Handler (LAST)
 */
app.use('*', (req, res) => {
  console.error(`❌ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

/**
 * ✅ Start Server (Railway-safe)
 */
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Health: /api/health`);
  console.log(`🔐 Auth: /api/auth/login | /api/auth/signup`);
  console.log(`🔗 Test: /api/test`);
});
