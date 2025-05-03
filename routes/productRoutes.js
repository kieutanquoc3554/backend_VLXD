const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/", productController.getProducts);
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.get("/check", productController.checkProductExists);
router.put("/hide/:id", productController.hideProduct);
router.put("/delete/:id", productController.deleteProduct);

module.exports = router;
