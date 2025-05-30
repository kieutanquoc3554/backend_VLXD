const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/orderController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/", authMiddleware, OrderController.getAllOrders);
router.get("/:id", authMiddleware, OrderController.getOrdersById);
router.post("/", authMiddleware, OrderController.createOrder);
router.put("/:id/status", authMiddleware, OrderController.updateOrderStatus);
router.put("/:id/cancel", authMiddleware, OrderController.cancelOrder);

module.exports = router;
