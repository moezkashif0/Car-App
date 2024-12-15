const express = require('express');
const router = express.Router();
const Car = require('../models/Car');

// POST route to add a car
//router.post('/cars', async (req, res) => {
  //try {
    //const car = new Car(req.body);
    //const savedCar = await car.save();
    //res.status(201).json(savedCar);
  //} catch (error) {
    //res.status(400).json({ message: error.message });
  //}
//});

router.get('/cars/search', async (req, res) => {
  try {
    const { 
      make, 
      model, 
      year, 
      minPrice, 
      maxPrice, 
      color, 
      fuelType, 
      transmission,
      page = 1,
      limit = 10 
    } = req.query;
    
    let query = {};

    if (make) query.make = new RegExp(make, 'i');
    if (model) query.model = new RegExp(model, 'i');
    if (color) query.color = new RegExp(color, 'i');
    if (fuelType) query.fuelType = new RegExp(fuelType, 'i');
    if (transmission) query.transmission = new RegExp(transmission, 'i');
    if (year) query.year = parseInt(year);
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const totalDocs = await Car.countDocuments(query);

    const results = await Car.find(query)
      .skip(startIndex)
      .limit(parseInt(limit));

    res.json({
      cars: results,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalDocs / parseInt(limit)),
        totalItems: totalDocs,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
