const express = require("express");
const router = express.Router();

const { createBill } = require("../controllers/BillController");

router.route("/").post(createBill);

module.exports = router;
