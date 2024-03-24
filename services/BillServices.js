const { default: mongoose } = require("mongoose");
const BillModel = require("../models/Bill");
const ProductModel = require("../models/Product");
const { handleError } = require("../utils/sharedUtils");
const {
  Types: { ObjectId },
} = require("mongoose");

const getLastBillCode = async () => {
  try {
    // Find the latest bill by sorting in descending order based on creation date
    let latestBill = await BillModel.findOne().sort({ createdAt: -1 }).exec();

    // Check if any bill is found
    if (!latestBill) {
      // If no bill is found, return "INV0000"
      return "INV0000";
    }

    // Return the code of the latest bill
    return latestBill.code;
  } catch (error) {
    throw new Error(`Error fetching last bill code: ${error.message}`);
  }
};

const saveBill = async (data) => {
  try {
    let productArray = [];
    let total = 0;
    for (const med of data.products) {
      const { productId, qty, price } = med;

      const product_id = productId ? new ObjectId(productId) : null;

      // Push the medicine object into the array
      productArray.push({
        product: product_id,
        qty: parseFloat(qty),
        price: parseFloat(price),
      });

      // Update product quantity
      await ProductModel.findOneAndUpdate(
        { _id: product_id },
        { $inc: { qty: -parseFloat(qty) } } // Decrease the quantity
      );

      total = total + parseFloat(price);
    }

    const formData = {
      code: data.nextCode,
      medicines: productArray,
      pharmacist: data.pharmacist_id,
      total: total,
    };

    const bill = new BillModel(formData);
    await bill.save();
    return bill.code;
  } catch (error) {
    throw new Error(`Error fetching last bill code: ${error.message}`);
  }
};

module.exports = {
  getLastBillCode,
  saveBill,
};
