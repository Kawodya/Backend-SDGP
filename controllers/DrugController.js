// Importing the DrugServices module
const DrugService = require("../services/DrugServices");

// Controller function to get all drugs
const getAllDrugs = async (req, res) => {
  try {
    // Call the getAllDrugs function from the DrugService module
    const drugs = await DrugService.getAllDrugs();
    // Send a JSON response with the fetched drugs and success status
    res.json({ data: drugs, status: "success" });
  } catch (err) {
    // If an error occurs, send a 500 status response with the error message
    res.status(500).json({ error: err.message });
  }
};

// Controller function to create a drug
const createDrug = async (req, res) => {
  try {
    // Call the createDrug function from the DrugService module with the request body
    const drug = await DrugService.createDrug(req.body);
    // Send a JSON response with the created drug and success status
    res.json({ data: drug, status: "success" });
  } catch (err) {
    // If an error occurs, send a 500 status response with the error message
    res.status(500).json({ error: err.message });
  }
};

// Exporting the controller functions
module.exports = {
  createDrug,
  getAllDrugs,
};
