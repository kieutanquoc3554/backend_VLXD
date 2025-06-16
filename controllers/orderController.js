const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Transaction = require("../models/transactionModel");
const Payment = require("../models/paymentModel");
const Inventory = require("../models/inventoryModel");

exports.getAllOrders = async (req, res) => {
  try {
    const data = await Order.getAllOrders();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách đơn hàng", error });
  }
};

exports.getOrdersById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Order.getOrderById(id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy đơn hàng", error });
  }
};

exports.createOrder = async (req, res) => {
  const { customer_id, items, payment_method, paid_amount } = req.body;
  try {
    let enrichedItems = [];
    let total = 0;
    for (const item of items) {
      const product = await Inventory.getProductById(item.product_id);
      if (!product)
        return res.status(400).json({ message: "Sản phẩm không tồn tại" });
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Sản phẩm ${product.name} chỉ còn ${product.quantity} sản phẩm trong kho`,
        });
      }
      const price = product.price;
      const subtotal = item.quantity * price;
      total += subtotal;
      enrichedItems.push({ ...item, price });
    }
    const { order_id } = await Order.createOrder(
      customer_id,
      enrichedItems,
      req.user.id,
      paid_amount
    );
    for (const item of enrichedItems) {
      await Transaction.createTransaction({
        product_id: item.product_id,
        transaction_type: "Export",
        quantity: item.quantity,
        employee_id: req.user.id,
      });
      await Product.decreaseStockQuantity(item.product_id, item.quantity);
    }
    if (payment_method) {
      await Payment.createPayment(order_id, payment_method, paid_amount);
    }
    res.status(200).json({ message: "Tạo đơn hàng thành công!", order_id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi tạo đơn hàng", error });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const result = await Order.updateOrderStatus(id, status);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật trạng thái đơn hàng", error });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await Order.getOrderById(id);
    const currentStatus = orders[0].status;
    if (currentStatus === "Completed") {
      return res
        .status(400)
        .json({ message: "Không thể huỷ đơn hàng đã hoàn thành" });
    }
    const result = await Order.updateOrderStatus(id, "Cancelled");
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi huỷ đơn hàng", error });
  }
};

exports.searchOrder = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Không có từ khoá tìm kiếm" });
    }
    const results = await Order.searchOrder(query);
    res.json(results);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server!", error });
  }
};
