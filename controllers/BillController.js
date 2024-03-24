// Importing the BillServices module
const billService = require("../services/BillServices");

const {
  Types: { ObjectId },
} = require("mongoose");

const createBill = async (req, res) => {
  const { pharmacistId, products } = req.body;
  try {
    // Get the last bill code
    let lastCode = await billService.getLastBillCode();
    let nextCode = "";
    if (lastCode !== "INV0000") {
      // Extract the numeric part of the last code and increment it
      const lastNumber = parseInt(lastCode.slice(3)); // Assuming the code format is always "INV" followed by digits
      const nextNumber = lastNumber + 1;

      // Generate the next code by combining the prefix "INV" with the incremented number
      nextCode = `INV${nextNumber.toString().padStart(4, "0")}`; // Assuming you want a 4-digit number padded with zeros
    } else {
      nextCode = "INV0001";
    }

    const pharmacist_id = pharmacistId ? new ObjectId(pharmacistId) : null;

    const billData = { nextCode, pharmacist_id, products };

    const saveBill = await billService.saveBill(billData);

    res.json({ data: saveBill, status: "success" });
  } catch (err) {
    // If an error occurs, send a 500 status response with the error message
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createBill,
};
