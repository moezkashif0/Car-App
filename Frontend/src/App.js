import React, { useState } from 'react';
import axios from 'axios';
import { FaSearch, FaCar, FaFilter } from 'react-icons/fa';
import './App.css';

function App() {
  const [searchParams, setSearchParams] = useState({
    make: '',
    model: '',
    year: '',
    minPrice: '',
    maxPrice: '',
    color: '',
    fuelType: '',
    transmission: ''
  });
  const [cars, setCars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const colors = ['Black', 'White', 'Silver', 'Red', 'Blue', 'Grey'];
  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
  const transmissionTypes = ['Automatic', 'Manual'];
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSearch = async (page = 1) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      queryParams.append('page', page);
      queryParams.append('limit', 10);

      const response = await axios.get(`http://localhost:5000/api/cars/search?${queryParams}`);
      if (response.data && response.data.cars) {
        setCars(response.data.cars);
        setTotalPages(response.data.pagination.totalPages);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error searching cars:', error);
    }
  };

  const Pagination = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handleSearch(i)}
          className={currentPage === i ? 'active' : ''}
          disabled={currentPage === i}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="pagination">
        <button
          onClick={() => handleSearch(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {pages}
        <button
          onClick={() => handleSearch(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="app-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Find Your Perfect Car</h1>
          <p>Browse through thousands of cars to find the one that fits you best</p>
        </div>
      </div>

      <div className="search-section">
        <div className="search-header">
          <FaFilter className="filter-icon" />
          <h2>Search Filters</h2>
        </div>

        <div className="filter-container">
          <div className="filter-row">
            <div className="filter-group">
              <label>Make</label>
              <input
                type="text"
                name="make"
                placeholder="Enter Make"
                value={searchParams.make}
                onChange={handleInputChange}
              />
            </div>

            <div className="filter-group">
              <label>Model</label>
              <input
                type="text"
                name="model"
                placeholder="Enter Model"
                value={searchParams.model}
                onChange={handleInputChange}
              />
            </div>

            <div className="filter-group">
              <label>Year</label>
              <input
                type="number"
                name="year"
                placeholder="Enter Year"
                value={searchParams.year}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label>Price Range</label>
              <div className="price-inputs">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min Price"
                  value={searchParams.minPrice}
                  onChange={handleInputChange}
                />
                <span className="price-separator">to</span>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max Price"
                  value={searchParams.maxPrice}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Color</label>
              <div className="color-selector">
                {colors.map(color => (
                  <div
                    key={color}
                    className={`color-option ${searchParams.color === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    onClick={() => setSearchParams({ ...searchParams, color })}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label>Fuel Type</label>
              <div className="fuel-options">
                {fuelTypes.map(fuel => (
                  <button
                    key={fuel}
                    className={`fuel-button ${searchParams.fuelType === fuel ? 'active' : ''}`}
                    onClick={() => setSearchParams({ ...searchParams, fuelType: fuel })}
                  >
                    {fuel}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>Transmission</label>
              <div className="transmission-toggle">
                {transmissionTypes.map(trans => (
                  <button
                    key={trans}
                    className={`trans-button ${searchParams.transmission === trans ? 'active' : ''}`}
                    onClick={() => setSearchParams({ ...searchParams, transmission: trans })}
                  >
                    {trans}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button className="search-button" onClick={() => handleSearch(1)}>
            <FaSearch /> Search Cars
          </button>
        </div>
      </div>

      <div className="results-section">
        {cars.length > 0 ? (
          <>
            <div className="results-header">
              <h2>Search Results</h2>
              <p>{cars.length} cars found</p>
            </div>
            <div className="car-grid">
              {cars.map(car => (
                <div key={car._id} className="car-card">
                  <div className="car-image">
                    <FaCar className="car-icon" />
                  </div>
                  <div className="car-details">
                    <h3>{car.make} {car.model}</h3>
                    <div className="car-info">
                      <span className="year">{car.year}</span>
                      <span className="price">${car.price?.toLocaleString()}</span>
                    </div>
                    <div className="car-specs">
                      <span>{car.fuelType}</span>
                      <span>•</span>
                      <span>{car.transmission}</span>
                      <span>•</span>
                      <span>{car.color}</span>
                    </div>
                    <div className="car-mileage">
                      <span>{car.mileage?.toLocaleString()} km</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Pagination />
          </>
        ) : (
          <div className="no-results">
            <FaCar className="no-results-icon" />
            <h3>No cars found</h3>
            <p>Try adjusting your search filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
