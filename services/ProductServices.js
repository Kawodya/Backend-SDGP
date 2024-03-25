const { default: mongoose } = require("mongoose");
const ProductModel = require("../models/Product");
const BrandModel = require("../models/Brand");
const DrugModel = require("../models/Drug");
const PharmacyProductModel = require("../models/PharmacyProduct");
const {
  Types: { ObjectId },
} = require("mongoose");

const getAllProducts = async () => {
  try {
    const products = await ProductModel.find()
      .populate("brand")
      .populate("drug");
    return products;
  } catch (error) {
    throw new Error(`Error fetching tags: ${error.message}`);
  }
};

const createProduct = async (data) => {
  try {
    const brand_id = data.brand_id ? new ObjectId(data.brand_id) : null;
    const drug_id = data.drug_id ? new ObjectId(data.drug_id) : null;
    const user_id = data.user_id ? new ObjectId(data.user_id) : null;

    const productData = {
      brand: brand_id,
      drug: drug_id,
      price: parseFloat(data.price),
      qty: parseInt(data.qty),
      dosage: data.dosage,
      special_instruction: data.special_instruction,
    };

    const newProduct = new ProductModel(productData);

    await newProduct.save();

    // If there is a brand associated with the product, update the brand
    if (brand_id) {
      // Find the brand by its ID and update its products array
      await BrandModel.findByIdAndUpdate(brand_id, {
        $push: { products: newProduct._id },
      });
    }
    // If there is a drug associated with the product, update the drug
    if (drug_id) {
      // Find the drug by its ID and update its products array
      await DrugModel.findByIdAndUpdate(drug_id, {
        $push: { products: newProduct._id },
      });
    }

    // Add the newly created product to the PharmacyProduct model
    await PharmacyProductModel.findOneAndUpdate(
      { user: user_id },
      { $push: { products: newProduct._id } },
      { upsert: true } // Create a new document if it doesn't exist
    );
    // Return the newly created product
    return newProduct;
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const editProduct = async (productId, data) => {
  try {
    const { qty } = data;
    // Check if productId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error("Invalid product ID");
    }

    // Prepare update data
    const updateData = {};
    if (qty !== undefined) {
      updateData.qty = parseFloat(qty);
    }
    

    // Update the product
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      { $set: updateData },
      { new: true } // to return the updated document
    );

    if (!updatedProduct) {
      throw new Error("Product not found");
    }

    return updatedProduct;
  } catch (error) {
    throw new Error(`Error editing product: ${error.message}`);
  }
};

const getProductsByDrugName = async (brand) => {
  try {
    const drug = await DrugModel.findOne({ drug_name: brand });
    const products = await ProductModel.find({ drug: drug._id })
      .populate("brand")
      .populate("drug");
    return products;
  } catch (error) {
    throw new Error(`Error fetching tags: ${error.message}`);
  }
};
module.exports = {
  createProduct,
  getAllProducts,
  editProduct,
  getProductsByDrugName,
};
