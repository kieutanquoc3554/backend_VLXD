const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/", inventoryController.getAll);
router.get("/:id", inventoryController.getById);
router.get("/product/:id", inventoryController.getProductById);
router.post("/", authMiddleware, inventoryController.create);
router.put("/:id", authMiddleware, inventoryController.update);
router.delete("/:id", inventoryController.delete);
router.get("/search/keyword", inventoryController.search);
router.get("/history/logs", inventoryController.getAllInventoryLogs);
router.post(
  "/stock-check",
  authMiddleware,
  inventoryController.createStockCheck
);
router.get("/stock-check/all", inventoryController.getAllStockCheckReports);
router.get("/stock-check/detail", inventoryController.getStockCheckDetails);

module.exports = router;
