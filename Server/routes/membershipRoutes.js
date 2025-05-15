const express = require("express");
const router = express.Router();
const membershipController = require("../controllers/membershipController");

router.post("/create-order", membershipController.createMembershipOrder);
router.post("/confirmMembershipPayment", membershipController.confirmMembershipPayment);
router.get("/get/:userId", membershipController.getMembership);
router.get("/getAllPayments", membershipController.getAllMembershipPayments);
router.get("/getUserPlanDetails/:userId", membershipController.getUserPlanDetails);
router.get("/getALLplan", membershipController.getPlan);
router.get("/checkMembershipStatus/:userId", membershipController.checkMembershipStatus);
router.get("/getAllProductOrders", membershipController.getAllProductOrders);
router.delete("/delete/:userId", membershipController.deleteMembership);
router.put("/updateOrderinfo/:id", membershipController.updateDeliveryStatus);


module.exports = router;
