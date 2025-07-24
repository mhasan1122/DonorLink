const db = require('../utils/db');

exports.getDivisions = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM divisions');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

exports.getZilas = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM zilas WHERE divisionId = ?', [req.params.divisionId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

exports.getUpazilas = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM upazilas WHERE zilaId = ?', [req.params.zilaId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
}; 