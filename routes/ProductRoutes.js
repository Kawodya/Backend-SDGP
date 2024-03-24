const express = require("express");
const router = express.Router();

const {
  createProduct,
  editProduct,
  getAllProducts,
  getProductsByDrugName,
} = require("../controllers/ProductController");

router.route("/").get(getAllProducts).post(createProduct);
router.route("/:id").put(editProduct);
router.route("/:brand").get(getProductsByDrugName);

module.exports = router;
