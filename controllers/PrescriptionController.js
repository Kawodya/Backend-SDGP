// Importing the BrandServices module
const prescriptionService = require("../services/PrescriptionServices");

// Importing the UserModel
const UserModel = require("../models/User");
const UserPrescriptionModel = require("../models/UserPrescription");

// Controller function to get all brands
const getAllPrescriptions = async (req, res) => {
  try {
    // Call the getAllBrands function from the brandService module
    const prescriptions = await prescriptionService.getAllPrescriptions();
    // Send a JSON response with the fetched brands and success status
    res.json({ data: prescriptions, status: "success" });
  } catch (err) {
    // If an error occurs, send a 500 status response with the error message
    res.status(500).json({ error: err.message });
  }
};

// Controller function to get a prescription by its code
const getPrescriptionByCode = async (req, res) => {
  try {
    // Extract the code from the request parameters
    const { code } = req.params;

    // Call the getPrescriptionByCode function from the prescriptionService module
    const prescription = await prescriptionService.getPrescriptionByCode(code);

    // Send a JSON response with the fetched prescription and success status
    res.json({ data: prescription, status: "success" });
  } catch (err) {
    // If an error occurs, send a 500 status response with the error message
    res.status(500).json({ error: err.message });
  }
};

// Controller function to create a brand
const createPrescription = async (req, res) => {
  try {
    // Call the createBrand function from the brandService module with the request body
    const prescription = await prescriptionService.createPrescription(req.body);
    // Send a JSON response with the created brand and success status
    res.json({ data: prescription, status: "success" });
  } catch (err) {
    // If an error occurs, send a 500 status response with the error message
    res.status(500).json({ error: err.message });
  }
};

// Function to associate a prescription with a user
const addPrescriptionToUser = async (userId, prescriptionId) => {
  try {
    // Find the user by ID
    const user = await UserPrescriptionModel.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Check if the prescription ID is valid (optional)
    // You may want to validate the prescription ID here

    // Associate the prescription with the user
    user.prescriptions.push(prescriptionId);

    // Save the user with the new prescription association
    await user.save();

    return { message: "Prescription added to user successfully" };
  } catch (error) {
    throw new Error(`Error adding prescription to user: ${error.message}`);
  }
};

// Controller function to get a user by ID
const getPrescriptionByUser = async (req, res) => {
  try {
    // Extract the user ID from the request parameters
    const userId = new ObjectId(req.params.id);
    // Validate the user ID
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    // Find the user by ID
    const prescriptions = await UserPrescriptionModel.findOne({
      user: userId,
    }).populate("prescriptions");
    // If user not found, return 404 status
    if (!prescriptions) {
      return res.status(404).json({ message: "Prescriptions not found" });
    }
    // Send a JSON response with the fetched user and success status
    res.json({ data: prescriptions, status: "success" });
  } catch (error) {
    // If an error occurs, send a 500 status response with the error message
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Controller function to get a user by ID
const getPharmacistsWithProducts = async (req, res) => {
  try {
    // Extract the user ID from the request parameters
    const districtId = new ObjectId(req.params.district_id);
    const prescriptionId = new ObjectId(req.params.prescription_id);

    const prescriptions = await prescriptionService.getPharmacistsWithProducts(
      districtId,
      prescriptionId
    );
    // Send a JSON response with the created brand and success status
    res.json({ data: prescriptions, status: "success" });
  } catch (error) {
    // If an error occurs, send a 500 status response with the error message
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Exporting the controller functions
module.exports = {
  createPrescription,
  getAllPrescriptions,
  getPrescriptionByUser,
  addPrescriptionToUser,
  getPrescriptionByCode,
  getPharmacistsWithProducts,
};
