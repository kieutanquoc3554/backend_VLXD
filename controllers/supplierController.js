const Supplier = require("../models/supplierModel");

exports.getSuppliers = async (req, res) => {
  try {
    const response = await Supplier.getAllSuppliers();
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
};

exports.getSupplierById = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Supplier.getSupplierById(id);
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
};

exports.createSupplier = async (req, res) => {
  const { name, phone, email, address } = req.body;
  try {
    await Supplier.createSupplier(name, phone, email, address);
    res.status(201).json({ message: "Thêm nhà cung cấp thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.updateSupplier = async (req, res) => {
  const { name, phone, email, address } = req.body;
  try {
    const response = await Supplier.updateSupplier(
      req.params.id,
      name,
      phone,
      email,
      address
    );
    if (response) {
      res.json({ message: "Cập nhật thành công!" });
    } else {
      res.status(404).json({ message: "Nhà cung cấp không tồn tại!" });
    }
  } catch (error) {
    res.json({ error: "Lỗi server!" });
  }
};

exports.deleteSupplier = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Supplier.deleteSupplier(id);
    if (response) {
      res.json({ message: "Xoá thành công!" });
    } else {
      res.status(404).json({ message: "Nhà cung cấp không tồn tại!" });
    }
  } catch (error) {
    res.json({ error: "Lỗi server!" });
  }
};

exports.restoreSupplier = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Supplier.restoreSupplier(id);
    if (response) {
      res.json({ message: "Khôi phục thành công!" });
    } else {
      res.status(404).json({ message: "Nhà cung cấp không tồn tại" });
    }
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
};
