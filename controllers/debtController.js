const debtModel = require("../models/debtModel");
const orderModel = require("../models/orderModel");
const paymentModel = require("../models/paymentModel");
const supplierPaymentModel = require("../models/supplierPaymentModel");

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

exports.getSupplierDebtDetail = async (req, res) => {
  const transactionId = req.params.id;
  try {
    const transaction = await debtModel.getTransactionById(transactionId);
    console.log(transaction);

    if (!transaction) {
      return res.status(404).json({ message: "Không tìm thấy công nợ" });
    }
    const items = await debtModel.getImportSlipItems(
      transaction.import_slip_id
    );
    const payments = await debtModel.getPaymentsByTransactionId(transactionId);
    return res.json({
      ...transaction,
      items,
      payments,
    });
  } catch (error) {
    console.error("Lỗi lấy chi tiết công nợ:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

exports.updateSupplierDebt = async (req, res) => {
  const { amount } = req.body;
  const { id } = req.params;
  try {
    await supplierPaymentModel.createSupplierPayment(
      id,
      amount,
      `Thanh toán đơn hàng`
    );
    await res.status(200).json({ message: "Cập nhật thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error });
  }
};

exports.searchDebts = async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: "Thiếu từ khoá tìm kiếm!" });
  }
  try {
    const result = await debtModel.searchDebts(query);
    res.json(result);
  } catch (error) {
    console.error("Lỗi tìm kiếm công nợ:", err);
    res.status(500).json({ error: "Lỗi máy chủ khi tìm kiếm công nợ" });
  }
};

exports.filterDebtsByDate = async (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ message: "Thiếu ngày giờ tìm kiếm!" });
  }
  try {
    const result = await debtModel.filterDebtByDate(date);
    res.json(result);
  } catch (error) {
    console.error("Lỗi tìm kiếm công nợ:", err);
    res.status(500).json({ error: "Lỗi máy chủ khi tìm kiếm công nợ" });
  }
};
