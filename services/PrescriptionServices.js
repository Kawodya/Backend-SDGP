const { default: mongoose } = require("mongoose");
const ProductModel = require("../models/Product");
const PrescriptionModel = require("../models/Prescription");
const UserModel = require("../models/User");

const {
  Types: { ObjectId },
} = require("mongoose");

const getAllPrescriptions = async () => {
  try {
    const prescriptions = await PrescriptionModel.find().populate(
      "medicines.product"
    );

    return prescriptions;
  } catch (error) {
    throw new Error(`Error fetching prescriptions: ${error.message}`);
  }
};

const createPrescription = async (data) => {
  try {
    // Create an array to store medicines
    const medicinesArray = [];
    console.log(data);
    // Loop through the medicines data and create objects to push into the medicines array
    for (const med of data.medicines) {
      const { medicineId, useInstructions } = med;

      const product_id = medicineId ? new ObjectId(medicineId) : null;
      // Push the medicine object into the array
      medicinesArray.push({
        product: product_id,
        user_instruction: useInstructions,
      });
    }

    // console.log(medicinesArray)

    const presData = {
      code: data.code,
      user_name: data.user_name,
      age: data.age,
      date: data.date,
      medicines: medicinesArray, // Assign the medicines array
    };

    const newPrescription = new PrescriptionModel(presData);

    await newPrescription.save();
    // Return the newly created product
    return newPrescription;
  } catch (err) {
    throw new Error(`Error creating prescriptions: ${err.message}`);
  }
};

const getPrescriptionByCode = async (code) => {
  try {
    const prescription = await PrescriptionModel.findOne({ code }).populate({
      path: "medicines",
      populate: {
        path: "product",
        populate: [
          {
            path: "drug",
          },
          {
            path: "brand",
          },
        ],
      },
    });

    if (!prescription) {
      throw new Error("Prescription not found");
    }

    return prescription;
  } catch (error) {
    throw new Error(`Error fetching prescription: ${error.message}`);
  }
};

const getPharmacistsWithProducts = async (districtId, prescriptionId) => {
  try {
    // Retrieve prescription details
    const prescription = await PrescriptionModel.findById(prescriptionId);

    if (!prescription) {
      throw new Error("Prescription not found");
    }

    const productIds = prescription.medicines.map((med) => med.product_id);

    // Find all pharmacists in the given district
    const pharmacists = await UserModel.find({
      "roles.role": "pharmacist",
      "roles.district": districtId,
    });

    // Initialize a map to store pharmacist details with their product totals
    const pharmacistProductTotals = new Map();

    // Iterate over each pharmacist to find their associated products and calculate totals
    for (const pharmacist of pharmacists) {
      const pharmacistId = pharmacist._id.toString();
      const pharmacistName = pharmacist.name;

      // Find all products associated with the pharmacist
      const products = await ProductModel.find({
        _id: { $in: productIds },
        brand: pharmacistId, // Assuming brand represents the pharmacist in this context
      });

      let totalQuantity = 0;
      let totalPrice = 0;

      // Calculate total quantity and price for each product
      for (const product of products) {
        const { qty, price } = product;
        totalQuantity += qty;
        totalPrice += qty * price;
      }

      // Store pharmacist details with their product totals
      pharmacistProductTotals.set(pharmacistName, {
        totalQuantity,
        totalPrice,
      });
    }

    return pharmacistProductTotals;
  } catch (error) {
    throw new Error(
      `Error fetching pharmacists with products: ${error.message}`
    );
  }
};

module.exports = {
  createPrescription,
  getAllPrescriptions,
  getPrescriptionByCode,
  getPharmacistsWithProducts,
};