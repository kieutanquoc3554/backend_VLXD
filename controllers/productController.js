const productModel = require("../models/productModel");
const inventoryModel = require("../models/inventoryModel");
const db = require("../utils/db");

exports.uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      next(new Error("No file uploaded!"));
      return;
    }
    res.json({ secure_url: req.file.path });
  } catch (error) {
    console.error("Lỗi khi upload ảnh:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await productModel.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = ({
      name,
      category_id,
      supplier_id,
      import_price,
      price,
      stock_quantity,
      unit,
      description,
      image_url,
    } = req.body);
    const result = await productModel.createProduct(product);
    await inventoryModel.create({
      product_id: result.insertId,
      quantity: product.stock_quantity,
      warehouse_location: "Cà Mau",
    });
    await res.status(201).json({
      message: "Thêm sản phẩm thành công!",
      product_id: result,
    });
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

exports.checkProductExists = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: "Tên sản phẩm là bắt buộc" });
    }
    const product = await productModel.findProductByName(name);
    if (product) {
      res.json({ exists: true, product });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error("Lỗi kiểm tra sản phẩm:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = req.body;
    const response = await productModel.updateProduct(id, product);
    res.status(200).json({
      message: "Cập nhật sản phẩm thành công!",
      response,
      id: id,
      data: product,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

exports.hideProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const [product] = await db.query(
      "SELECT disabled FROM products WHERE id = ?",
      [id]
    );
    const currentProduct = product[0];
    if (!currentProduct) {
      res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
    }
    const newDisabledValue = currentProduct.disabled === 1 ? 0 : 1;
    await productModel.updateProduct(id, { disabled: newDisabledValue });
    res.status(200).json({
      message: newDisabledValue
        ? "Sản phẩm đã bị ẩn!"
        : "Sản phẩm đã hiển thị lại!",
    });
  } catch (error) {
    console.error("Lỗi khi ẩn sản phẩm:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const [productRows] = await db.query(
      "SELECT isDeleted FROM products WHERE id = ?",
      [id]
    );
    const product = productRows[0];
    if (!product) {
      res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
    }
    if (product.isDeleted === 1) {
      res.status(400).json({ message: "Sản phẩm đã bị xoá trước đó!" });
    }
    await productModel.updateProduct(id, { isDeleted: 1 });
    res.status(200).json({ message: "Sản phẩm đã được xoá thành công!" });
  } catch (error) {
    console.error("Lỗi khi xoá sản phẩm:", error);
    res
      .status(500)
      .json({ message: "Đã xảy ra lỗi phía server khi xoá sản phẩm.", error });
  }
};
