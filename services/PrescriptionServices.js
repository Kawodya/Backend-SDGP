const { default: mongoose } = require("mongoose");
const ProductModel = require("../models/Product");
const PrescriptionModel = require("../models/Prescription");
const PharmacyProductModel = require("../models/PharmacyProduct");
const UserModel = require("../models/User");

const {
  Types: { ObjectId },
} = require("mongoose");

const getAllPrescriptions = async () => {
  try {
    const prescriptions = await PrescriptionModel.find()
      .populate("medicines.product")
      .sort({ _id: -1 });

    return prescriptions;
  } catch (error) {
    throw new Error(`Error fetching prescriptions: ${error.message}`);
  }
};

const createPrescription = async (data) => {
  try {
    // Create an array to store medicines
    const medicinesArray = [];

    // Loop through the medicines data and create objects to push into the medicines array
    for (const med of data.medicines) {
      const { medicineId, userId, useInstructions } = med;

      const product_id = medicineId ? new ObjectId(medicineId) : null;
      // const user_id = userId ? new ObjectId(userId) : null;
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
      user: data.user_id,
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

const getPharmacistsWithProducts = async (
  districtId,
  prescriptionId,
  longitude,
  latitude
) => {
  try {
    const userCoordinates = { latitude, longitude };

    // Retrieve prescription details
    const prescription = await PrescriptionModel.findOne({
      code: prescriptionId,
    });

    if (!prescription) {
      throw new Error("Prescription not found");
    }

    let totalQuantity = 0;
    let totalPrice = 0;

    const productIds = prescription.medicines.map((med) => med.product_id);

    // Find products in the prescription
    const products = await ProductModel.find({ _id: { $in: productIds } });

    // Calculate total quantity and total price
    products.forEach((product) => {
      totalQuantity += product.qty;
      totalPrice += product.price * product.qty;
    });

    let available_pharmacists = [];
    const pharmacists = await UserModel.find({
      roles: {
        $elemMatch: {
          role: "pharmacist",
          district: districtId,
        },
      },
    });

    for (const pharmacy of pharmacists) {
      // Find PharmacyProduct associated with the pharmacist
      const pharmacyProduct = await PharmacyProductModel.findOne({
        user: pharmacy._id,
      });

      // Check if all product IDs from the prescription are available in pharmacyProduct
      const allProductsAvailable = productIds.every((productId) =>
        pharmacyProduct.products.includes(productId)
      );

      if (allProductsAvailable) {
        const pharmacyCoordinates = {
          latitude: pharmacy.roles[0].latitude,
          longitude: pharmacy.roles[0].longitude,
        };
        const distance = geolib.getDistance(
          userCoordinates,
          pharmacyCoordinates
        );

        let data = {
          pharmacy,
          totalQuantity,
          totalPrice,
          distance,
        };
        // Push pharmacist's pharmacy product to available_pharmacists array
        available_pharmacists.push(data);
      }
    }
    return available_pharmacists;
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