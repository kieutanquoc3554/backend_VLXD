const express = require("express");
const router = express.Router();
const billController = require("../controllers/billController");

router.get("/", billController.getAllBill);
router.get("/search", billController.searchBill);
router.get("/filter", billController.searchBillByDate);

module.exports = router;
