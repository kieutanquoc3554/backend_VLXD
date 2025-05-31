const express = require("express");
const router = express.Router();
const debtController = require("../controllers/debtController");

router.get("/", debtController.getAllDebt);
router.get("/:id", debtController.getDetailsDebtsById);
router.post("/update/:id", debtController.updateDebtByOrderId);
router.get("/get/supplierDebt", debtController.getAllSupplierDebts);
router.get("/supplier-debts/:id", debtController.getSupplierDebtDetail);

module.exports = router;
