const SupplierPaymentModel = require("../models/supplierPaymentModel");

exports.createPayment = async (req, res) => {
  try {
    const { supplier_transactions_id, amount, note } = req.body;
    const result = await SupplierPaymentModel.createSupplierPayment(
      supplier_transactions_id,
      amount,
      note
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tạo thanh toán", error });
  }
};
