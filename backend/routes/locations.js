const express = require('express');
const router = express.Router();
const locationsController = require('../controllers/locationsController');

router.get('/divisions', locationsController.getDivisions);
router.get('/zilas/:divisionId', locationsController.getZilas);
router.get('/upazilas/:zilaId', locationsController.getUpazilas);

module.exports = router; 