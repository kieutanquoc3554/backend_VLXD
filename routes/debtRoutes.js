const express = require("express");
const router = express.Router();
const debtController = require("../controllers/debtController");

router.get("/", debtController.getAllDebt);
router.get("/:id", debtController.getDetailsDebtsById);
router.post("/update/:id", debtController.updateDebtByOrderId);
router.get("/get/supplierDebt", debtController.getAllSupplierDebts);
router.get("/supplier-debts/:id", debtController.getSupplierDebtDetail);
router.post("/updateSupplier/:id", debtController.updateSupplierDebt);
router.get("/search/searchDebt", debtController.searchDebts);
router.get("/filter/bydate", debtController.filterDebtsByDate);

module.exports = router;
