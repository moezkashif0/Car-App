const Car = require('../models/Car');

exports.searchCars = async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;
    
    const searchQuery = query
      ? {
          $or: [
            { make: { $regex: query, $options: 'i' } },
            { model: { $regex: query, $options: 'i' } }
          ]
        }
      : {};

    const cars = await Car.find(searchQuery)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Car.countDocuments(searchQuery);

    res.json({
      cars,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Error searching cars', error });
  }
};
