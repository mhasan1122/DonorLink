const express = require('express');
const router = express.Router();
const donorsController = require('../controllers/donorsController');

router.post('/', donorsController.createDonor);
router.get('/', donorsController.getDonors);
router.get('/:id', donorsController.getDonorById);

module.exports = router; 