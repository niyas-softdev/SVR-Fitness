const express = require("express");
const router = express.Router();

const {
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

const { verifyToken, verifyRole } = require("../middleware/checkAuthToken");

router.get("/get", getProduct);

router.post("/create", createProduct);

router.put("/update/:id", updateProduct);

router.delete("/delete/:id", deleteProduct);

module.exports = router;
