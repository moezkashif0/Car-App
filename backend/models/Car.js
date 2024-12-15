const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  make: { type: String, required: true, index: true },
  model: { type: String, required: true, index: true },
  year: { type: Number, required: false },
  price: { type: Number, required: false },
  color: { type: String, required: false },
  mileage: { type: Number, required: false },
  fuelType: { type: String, required: false },
  transmission: { type: String, required: false }
});

carSchema.index({ make: 'text', model: 'text' });

module.exports = mongoose.model('Car', carSchema);
