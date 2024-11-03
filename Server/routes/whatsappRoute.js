const express = require("express");
const { sendMsg } = require("../controllers/whatsApp"); // Correctly destructured if exported as object

const router = express.Router();

// Example of using sendMsg directly in a POST route
router.post("/send-message", sendMsg);

module.exports = router;
