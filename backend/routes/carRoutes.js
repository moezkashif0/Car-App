const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

// Routes
router.post('/cars', carController.addCar);
router.get('/cars/search', carController.searchCars);

module.exports = router;
