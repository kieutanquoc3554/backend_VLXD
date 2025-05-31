const debtModel = require("../models/debtModel");
const orderModel = require("../models/orderModel");
const paymentModel = require("../models/paymentModel");

exports.getAllDebt = async (req, res) => {
  try {
    const debt = await debtModel.getAllDebts();
    res.status(200).json(debt);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách công nợ" });
  }
};

exports.getDetailsDebtsById = async (req, res) => {
  try {
    const { id } = req.params;
    const detailsDebt = await debtModel.getDebtsByOrderId(id);
    res.status(200).json(detailsDebt);
  } catch (error) {
    res.status(500).json("Không thể lấy chi tiết công nợ", error);
  }
};

exports.updateDebtByOrderId = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, payment_method = "Cash" } = req.body;
    if (!amount || !payment_method) {
      return res.status(400).json({ message: "Thiếu thông tin thanh toán" });
    }
    const detailsDebt = await debtModel.getDebtsByOrderId(id);
    if (amount > detailsDebt.remaining_amount) {
      return res.status(400).json({
        message: `Số tiền tối đa cần thanh toán là: ${detailsDebt.remaining_amount}. Số tiền bạn đang thanh là: ${amount}`,
      });
    }
    await orderModel.updateDebtByOrderId(amount, id);
    await paymentModel.createPayment(id, payment_method, amount);
    res.status(200).json({ message: "Cập nhật công nợ hoàn tất" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật công nợ", error });
  }
};

exports.getAllSupplierDebts = async (req, res) => {
  try {
    const supplierDebts = await debtModel.getSupplierDebts();
    res.status(200).json(supplierDebts);
  } catch (error) {
    res.status(500).json({ message: "Có lỗi xảy ra!", error });
  }
};
