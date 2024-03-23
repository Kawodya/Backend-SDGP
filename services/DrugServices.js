const { default: mongoose } = require("mongoose");
const DrugModel = require("../models/Drug");

const {
  Types: { ObjectId },
} = require("mongoose");

const handleError = (error) => {
  console.error("Error:", error);
  throw new Error(`Error: ${error.message}`);
};

const getAllDrugs = async () => {
  try {
    const drugs = await DrugModel.find();
    return drugs;
  } catch (error) {
    throw new Error(`Error fetching tags: ${error.message}`);
  }
};

const createDrug = async (data) => {
  try {
    const newDrug = new DrugModel({
      drug_name: data.drug_name,
      products: data.products || [],
    });

    await newDrug.save();
  } catch (err) {
    handleError(err);
  }
};

module.exports = {
  createDrug,
  getAllDrugs
};
