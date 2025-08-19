const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/database');
const config = require('./config/config');
const { generalLimiter } = require('./middleware/rateLimiter');
const startDeviceCleanupJob = require('./jobs/deviceCleanup');

// Import routes
const authRoutes = require('./routes/auth');
const deviceRoutes = require('./routes/devices');
const analyticsRoutes = require('./routes/analytics');

const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// API Info endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Curvvtech Smart Device Management API',
    version: '1.0.0',
    endpoints: {
      auth: '/auth',
      devices: '/devices',
      analytics: '/devices/:id/logs and /devices/:id/usage'
    }
  });
});

// Routes
app.use('/auth', authRoutes);
app.use('/devices', deviceRoutes);
app.use('/devices', analyticsRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    message: config.nodeEnv === 'development' ? err.message : 'Something went wrong!'
  });
});

// Start background jobs
startDeviceCleanupJob();

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${config.nodeEnv}`);
  console.log(`🗄️  Database: ${config.mongodbUri}`);
  console.log(`⏰ Device cleanup job scheduled`);
});

module.exports = app;
