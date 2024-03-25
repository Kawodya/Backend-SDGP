const express = require("express");
const router = express.Router();

const {
  createPrescription,
  getAllPrescriptions,
  addPrescriptionToUser,
  getPrescriptionByCode,
  getPrescriptionByUser,
  getPharmacistsWithProducts,
} = require("../controllers/PrescriptionController");

router.route("/").get(getAllPrescriptions).post(createPrescription);
router.route("/add-prescription-to-user").post(addPrescriptionToUser);
router.route("/get-prescription-by-user/:id").get(getPrescriptionByUser);
router.route("/get-prescription-by-code/:code").get(getPrescriptionByCode);
router
  .route(
    "/get-pharmacists-by-prescription/:district_id/:prescription_id/:longitude/:latitude"
  )
  .get(getPharmacistsWithProducts);

module.exports = router;
