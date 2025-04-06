const express = require("express");
const router = express.Router();
const membershipController = require("../controllers/membershipController");

router.post("/create-order", membershipController.createMembershipOrder);
router.post("/confirm", membershipController.confirmMembershipPayment);
router.get("/get/:userId", membershipController.getMembership);
router.get("/getALLplan", membershipController.getPlan);
router.delete("/delete/:userId", membershipController.deleteMembership);

module.exports = router;
