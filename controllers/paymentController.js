const Payment = require("../models/paymentModel");

exports.createPayment = async () => {
  try {
    const { order_id, payment_method, amount } = req.body;
    const result = await Payment.createPayment(
      order_id,
      payment_method,
      amount
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tạo thanh toán", error });
  }
};
