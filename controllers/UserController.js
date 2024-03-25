// Importing necessary modules
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongoose").Types;
const { sendOTP } = require("./OtpController");

// Importing the UserModel
const UserModel = require("../models/User");
const OtpModel = require("../models/Otp");

// Controller function to get all users
exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await UserModel.find();
    // Send a JSON response with the fetched users and success status
    res.json({ data: users, status: "success" });
  } catch (err) {
    // If an error occurs, send a 500 status response with the error message
    res.status(500).json({ error: err.message });
  }
};

// Controller function to get a user by ID
exports.getUserById = async (req, res) => {
  try {
    // Extract the user ID from the request parameters
    const userId = new ObjectId(req.params.id);
    // Validate the user ID
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    // Find the user by ID
    const user = await UserModel.findOne({ _id: userId });
    // If user not found, return 404 status
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Send a JSON response with the fetched user and success status
    res.json({ data: user, status: "success" });
  } catch (error) {
    // If an error occurs, send a 500 status response with the error message
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    // Fetch all users with role 'doctor' from the database
    const doctors = await UserModel.find({ "roles.role": "doctor" });
    // Send a JSON response with the fetched doctors and success status
    res.json({ data: doctors, status: "success" });
  } catch (err) {
    // If an error occurs, send a 500 status response with the error message
    res.status(500).json({ error: err.message });
  }
};

// Controller function to get all patients
exports.getAllPatients = async (req, res) => {
  try {
    // Fetch all users with role 'patient' from the database
    const patients = await UserModel.find({ "roles[0].role": "patient" });
    // Send a JSON response with the fetched patients and success status
    res.json({ data: patients, status: "success" });
  } catch (err) {
    // If an error occurs, send a 500 status response with the error message
    res.status(500).json({ error: err.message });
  }
};

exports.getAllPharmacist = async (req, res) => {
  try {
    // Fetch all users with role 'patient' from the database
    const patients = await UserModel.find({ "roles.role": "pharmacist" });
    // Send a JSON response with the fetched patients and success status
    res.json({ data: patients, status: "success" });
  } catch (err) {
    // If an error occurs, send a 500 status response with the error message
    res.status(500).json({ error: err.message });
  }
};

exports.completeRegistration = async (req, res) => {
  try {
    const { otp } = req.body;
    console.log(otp);
    const otpRow = await OtpModel.find({ otp });
    console.log(otpRow);
    if (!otpRow) {
      return res.status(500).json({ message: "OTP is incorrect" });
    }

    return res.status(200).json({ message: "User is verrified" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller function to create a user
exports.createUser = async (req, res) => {
  try {
    // Destructure necessary fields from request body
    const {
      email,
      first_name,
      last_name,
      address,
      type,
      password,
      uniqueId,
      district,
      longitude,
      latitude,
    } = req.body;

    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await UserModel.create({
      email,
      first_name,
      last_name,
      name: first_name + " " + last_name,
      address,
      password: hashedPassword, // Now hashedPassword contains the actual hashed value
      roles: [
        {
          role: type,
          uniqueId,
          district,
          longitude,
          latitude,
        },
      ],
    });

    // Call sendOTP function
    await sendOTP(email, res);
    // Send a success message
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    // Handle duplicate key error for email
    if (
      error.code === 11000 &&
      error.keyPattern &&
      error.keyPattern.email === 1
    ) {
      return res.status(400).json({ message: "Email is already registered" });
    }
    // Handle other errors
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    // Destructure necessary fields from request body
    const { email, newPassword } = req.body;

    // Find the user by email
    const user = await UserModel.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    // Send a success message
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    // Handle other errors
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller function to login a user
exports.loginUser = async (req, res) => {
  try {
    // Extract email and password from request body
    const { email, password } = req.body;
    // Find user by email
    const user = await UserModel.findOne({ email });
    // If user not found, return 401 status
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    // If password doesn't match, return 401 status
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, "HTGWEWDWFSDCFSCW");
    // Send JWT token and user information in response
    res.status(200).json({
      token,
      user: {
        name: user.first_name + " " + user.last_name,
        email: user.email,
        user_id: user._id,
        role: user.roles[0].role,
        role_id: user.roles[0].uniqueId,
      },
    });
  } catch (error) {
    // If an error occurs, send a 500 status response with the error message
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
