const Inventory = require("../models/inventoryModel");
const Product = require("../models/productModel");

exports.getAll = async (req, res) => {
  try {
    const data = await Inventory.getAllInventory();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách kho hàng", error });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Inventory.getById(id);
    if (!item) return res.status(404).json({ message: "Không tìm thấy kho!" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy chi tiết kho", error });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Inventory.getProductById(id);
    if (!product)
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm trong kho!" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Lỗi tìm sản phẩm trong kho!" });
  }
};

exports.create = async (req, res) => {
  try {
    const id = await Inventory.create(req.body, req.user.id);
    const total = await Inventory.getTotalQuantityByProductId(
      req.body.product_id
    );
    await Product.updateStockQuantity(req.body.product_id, total);
    res.json({
      message: "Thêm mới tồn kho thành công!",
      id,
      new_stock_quantity: total,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi thêm kho hàng!", error });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    await Inventory.update(id, req.body, req.user.id);
    res.status(200).json({ message: "Cập nhật thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật kho!", error });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await Inventory.delete(id);
    res.json({ message: "Xoá thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xoá kho!", error });
  }
};

exports.search = async (req, res) => {
  try {
    const keyword = req.query.q || "";
    const result = await Inventory.search(keyword);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tìm kiếm kho hàng!", error });
  }
};

exports.getAllInventoryLogs = async (req, res) => {
  try {
    const result = await Inventory.getInventoryLogs();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi hiển thị lịch sử kho" });
  }
};

exports.createStockCheck = async (req, res) => {
  try {
    const checks = req.body;
    await Inventory.createStockCheck(checks, req.user.id);
    res.json({ message: "Đã lập báo cáo kiểm kho thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lập kiểm kho", error });
  }
};

exports.getAllStockCheckReports = async (req, res) => {
  try {
    const data = await Inventory.getAllStockCheckReports();
    res.json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi lấy danh sách báo cáo kiểm kho", error });
  }
};

exports.getStockCheckDetails = async (req, res) => {
  try {
    const { created_time, created_by } = req.query;
    const data = await Inventory.getStockCheckReportsDetail(
      created_time,
      created_by
    );
    res.json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy chi tiết phiếu kiểm kho", error });
  }
};
