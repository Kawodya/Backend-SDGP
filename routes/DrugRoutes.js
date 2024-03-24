const express = require("express");
const router = express.Router();

const { createDrug, getAllDrugs } = require("../controllers/DrugController");

router.route("/").get(getAllDrugs).post(createDrug);

module.exports = router;
