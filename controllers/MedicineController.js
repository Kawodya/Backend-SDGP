// Importing the BrandServices module
const brandService = require("../services/BrandServices");

// Controller function to get all brands
const getAllBrands = async (req, res) => {
  try {
    // Call the getAllBrands function from the brandService module
    const brands = await brandService.getAllBrands();
    // Send a JSON response with the fetched brands and success status
    res.json({ data: brands, status: "success" });
  } catch (err) {
    // If an error occurs, send a 500 status response with the error message
    res.status(500).json({ error: err.message });
  }
};

// Controller function to create a brand
const createBrand = async (req, res) => {
  try {
    // Call the createBrand function from the brandService module with the request body
    const brand = await brandService.createBrand(req.body);
    // Send a JSON response with the created brand and success status
    res.json({ data: brand, status: "success" });
  } catch (err) {
    // If an error occurs, send a 500 status response with the error message
    res.status(500).json({ error: err.message });
  }
};

// Exporting the controller functions
module.exports = {
  createBrand,
  getAllBrands,
};
