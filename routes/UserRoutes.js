const express = require("express");

const {
  getAllUsers,
  createUser,
  loginUser,
  getAllDoctors,
  getAllPatients,
  getUserById,
  getAllPharmacist,
  completeRegistration,
  resetPassword,
} = require("../controllers/UserController");
const router = express.Router();

router.route("/reset-password").post(resetPassword);
router.route("/").get(getAllUsers).post(createUser);
router.route("/user-verifired").post(completeRegistration);
router.route("/login").post(loginUser);
router.route("/doctors").get(getAllDoctors);
router.route("/patients").get(getAllPatients);
router.route("/pharmacists").get(getAllPharmacist);
router.route("/:userId").get(getUserById);

module.exports = router;
