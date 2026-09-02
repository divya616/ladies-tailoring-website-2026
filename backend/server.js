const express = require('express');
const cors = require('cors');
const path = require('path');
const bookingsRouter = require('./routes/bookings');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins (allows Live Server, VS Code preview, or any frontend port)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toLocaleTimeString('en-IN')}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Serve frontend static files
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// API Routes
app.use('/api', bookingsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'Ambattur Classic Tailors API',
    location: 'Ambattur, Chennai - 600053, Tamil Nadu, India',
    timestamp: new Date().toISOString()
  });
});

// Fallback route to serve index.html for unknown web paths
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API Endpoint not found' });
  }
  res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
    if (err) next(err);
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

// Start Server
app.listen(PORT, () => {
  console.log('================================================================');
  console.log('  ✂️   AMBATTUR CLASSIC TAILORS — BACKEND & WEB SERVER  ✂️');
  console.log('================================================================');
  console.log(`  🚀 Server running at:       http://localhost:${PORT}`);
  console.log(`  🌐 Customer Storefront:     http://localhost:${PORT}/`);
  console.log(`  📋 Admin Dashboard:         http://localhost:${PORT}/admin.html`);
  console.log(`  📡 REST API Base URL:       http://localhost:${PORT}/api/bookings`);
  console.log(`  🩺 API Health Check:        http://localhost:${PORT}/api/health`);
  console.log('================================================================');
});

module.exports = app;
