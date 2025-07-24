const db = require('../utils/db');

function maskPhone(phone) {
  return phone ? phone.replace(/(\d{3})\d{4}(\d{3,})/, '$1****$2') : '';
}

function isValidPhone(phone) {
  return /^01[3-9]\d{8}$/.test(phone); // BD mobile
}

function isValidDate(date) {
  return !isNaN(Date.parse(date));
}

exports.createDonor = async (req, res) => {
  const {
    firstName, lastName, bloodGroup, divisionId, zilaId, upazilaId,
    village, currentLocation, lastDonationDate, phoneNumber, isAvailable, notes, consent
  } = req.body;
  if (!firstName || !lastName || !bloodGroup || !divisionId || !zilaId || !upazilaId || !currentLocation || !lastDonationDate || !phoneNumber || consent !== true) {
    return res.status(400).json({ error: 'Missing required fields or consent not given.' });
  }
  if (!isValidPhone(phoneNumber)) {
    return res.status(400).json({ error: 'Invalid phone number.' });
  }
  if (!isValidDate(lastDonationDate)) {
    return res.status(400).json({ error: 'Invalid date.' });
  }
  try {
    const [result] = await db.query(
      `INSERT INTO donors (firstName, lastName, bloodGroup, divisionId, zilaId, upazilaId, village, currentLocation, lastDonationDate, phoneNumber, isAvailable, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, bloodGroup, divisionId, zilaId, upazilaId, village, currentLocation, lastDonationDate, phoneNumber, isAvailable ?? true, notes]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

exports.getDonors = async (req, res) => {
  const { bloodGroup, divisionId, zilaId, upazilaId, available, lastDonationWithin } = req.query;
  let sql = 'SELECT * FROM donors WHERE 1=1';
  const params = [];
  if (bloodGroup) { sql += ' AND bloodGroup = ?'; params.push(bloodGroup); }
  if (divisionId) { sql += ' AND divisionId = ?'; params.push(divisionId); }
  if (zilaId) { sql += ' AND zilaId = ?'; params.push(zilaId); }
  if (upazilaId) { sql += ' AND upazilaId = ?'; params.push(upazilaId); }
  if (available !== undefined) { sql += ' AND isAvailable = ?'; params.push(available === 'true'); }
  if (lastDonationWithin) { sql += ' AND lastDonationDate >= DATE_SUB(CURDATE(), INTERVAL ? DAY)'; params.push(Number(lastDonationWithin)); }
  sql += ' ORDER BY updatedAt DESC';
  try {
    const [rows] = await db.query(sql, params);
    const donors = rows.map(d => ({ ...d, phoneNumber: maskPhone(d.phoneNumber) }));
    res.json(donors);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

exports.getDonorById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM donors WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Donor not found' });
    const donor = rows[0];
    donor.phoneNumber = maskPhone(donor.phoneNumber);
    res.json(donor);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
}; 