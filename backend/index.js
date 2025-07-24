require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// MySQL connection pool
const db = require('./utils/db');

const donorsRouter = require('./routes/donors');
const locationsRouter = require('./routes/locations');

app.use('/api/donors', donorsRouter);
app.use('/api', locationsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// TODO: Add routes for donors and locations

// Test DB connection on startup

db.getConnection()
  .then(conn => {
    console.log('MySQL database connected!');
    conn.release();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MySQL connection failed:', err.message);
    process.exit(1);
  }); 