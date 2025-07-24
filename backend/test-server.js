// Simple test server to verify everything works
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running!' });
});

// Mock divisions endpoint
app.get('/api/divisions', (req, res) => {
  res.json([
    { id: 1, name: 'Dhaka' },
    { id: 2, name: 'Chittagong' },
    { id: 3, name: 'Rajshahi' }
  ]);
});

// Mock donors endpoint
app.get('/api/donors', (req, res) => {
  res.json([
    {
      id: 1,
      firstName: 'Ahmed',
      lastName: 'Rahman',
      bloodGroup: 'O+',
      phoneNumber: '+880171****678',
      isAvailable: true
    }
  ]);
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Divisions: http://localhost:${PORT}/api/divisions`);
  console.log(`Donors: http://localhost:${PORT}/api/donors`);
});
