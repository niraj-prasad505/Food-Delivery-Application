const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/owner-auth.middleware");

const {
  createProduct,
  getMyProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/OwnerProduct.Controller");

router.use(authMiddleware);

// Base: /api/owner/products
router.post("/", createProduct);
router.get("/", getMyProducts);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;