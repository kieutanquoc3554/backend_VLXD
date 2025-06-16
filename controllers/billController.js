const billModel = require("../models/billModel");

exports.getAllBill = async (req, res) => {
  try {
    const bill = await billModel.getAllBill();
    res.status(200).json(bill);
  } catch (error) {}
};

exports.searchBill = async (req, res) => {
  const { query } = req.query;

  if (!query) return res.status(400).json({ error: "Thiếu từ khóa tìm kiếm" });

  try {
    const results = await billModel.searchBill(query);
    res.json(results);
  } catch (err) {
    console.error("Lỗi tìm kiếm phiếu thanh toán:", err);
    res
      .status(500)
      .json({ error: "Lỗi máy chủ khi tìm kiếm phiếu thanh toán" });
  }
};

exports.searchBillByDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res
        .status(400)
        .json({
          message: "Vui lòng cung cấp ngày (date) theo định dạng YYYY-MM-DD",
        });
    }
    const result = await billModel.filterBillByDate(date);
    res.json(result);
  } catch (error) {
    console.error("Lỗi khi tìm bill theo ngày:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
