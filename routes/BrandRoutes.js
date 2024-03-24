const express = require("express");
const router = express.Router();

const { createBrand, getAllBrands } = require("../controllers/BrandController");

router.route("/").get(getAllBrands).post(createBrand);

module.exports = router;
