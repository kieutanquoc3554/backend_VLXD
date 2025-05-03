const Customer = require("../models/customerModel");

exports.getAllCustomer = async (req, res) => {
  try {
    const customers = await Customer.getAllCustomers();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.createCustomer = async (req, res) => {
  const { name, phone, email, address } = req.body;
  try {
    const response = await Customer.createCustomer(name, phone, email, address);
    res.status(200).json({ message: response });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Số điện thoại đã tồn tại!" });
    }
    res.status(500).json({ message: "Lỗi server!" });
  }
};

exports.updateCustomer = async (req, res) => {
  const { name, phone, email, address } = req.body;
  const { id } = req.params;
  try {
    await Customer.updateCustomer(id, name, phone, email, address);
    res
      .status(200)
      .json({ message: "Cập nhật thông tin khách hàng thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
};

exports.deleteCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    await Customer.deleteCustomer(id);
    res.status(200).json({ message: "Xoá thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
};

exports.getCustomerById = async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await Customer.getCustomerById(id);
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
};

exports.restoreCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    await Customer.restoreCustomer(id);
    res.status(200).json({ message: "Khôi phục thành công!" });
  } catch (error) {
    console.log(error);
  }
};
