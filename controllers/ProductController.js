// Importing the BrandServices module
const productService = require("../services/ProductServices");

// Controller function to get all brands
const getAllProducts = async (req, res) => {
  try {
    // Call the getAllBrands function from the brandService module
    const products = await productService.getAllProducts();
    // Send a JSON response with the fetched brands and success status
    res.json({ data: products, status: "success" });
  } catch (err) {
    // If an error occurs, send a 500 status response with the error message
    res.status(500).json({ error: err.message });
  }
};

// Controller function to create a brand
const createProduct = async (req, res) => {
  try {
    // Call the createBrand function from the brandService module with the request body
    const product = await productService.createProduct(req.body);
    // Send a JSON response with the created brand and success status
    res.json({ data: product, status: "success" });
  } catch (err) {
    // If an error occurs, send a 500 status response with the error message
    res.status(500).json({ error: err.message });
  }
};

// Controller function to edit a product
const editProduct = async (req, res) => {
  try {
    const productId = req.params.id; // Assuming productId is passed as a route parameter
    // Call the editProduct function from the productService module with the productId and request body
    const updatedProduct = await productService.editProduct(
      productId,
      req.body
    );
    // Send a JSON response with the updated product and success status
    res.json({ data: updatedProduct, status: "success" });
  } catch (err) {
    // If an error occurs, send a 500 status response with the error message
    res.status(500).json({ error: err.message });
  }
};

const getProductsByDrugName = async (req, res) => {
  try {
    const brand = req.params.brand.replaceAll("-", " ");
    // Call the getAllBrands function from the brandService module
    const products = await productService.getProductsByDrugName(brand);
    // Send a JSON response with the fetched brands and success status
    res.json({ data: products, status: "success" });
  } catch (err) {
    // If an error occurs, send a 500 status response with the error message
    res.status(500).json({ error: err.message });
  }
};

// Exporting the controller functions
module.exports = {
  createProduct,
  editProduct,
  getAllProducts,
  getProductsByDrugName,
};
