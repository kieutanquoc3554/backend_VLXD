const Category = require("../models/categoryModel");

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.getCategoryById(id);
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.createCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    await Category.createCategory(name, description);
    res.json({ message: "Thêm danh mục sản phẩm thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error });
  }
};

exports.updateCategory = async (req, res) => {
  const { name, description, disabled, deleted } = req.body;
  try {
    await Category.updateCategory(
      req.params.id,
      name,
      description,
      disabled,
      deleted
    );
    res.json({ message: "Cập nhật danh mục sản phẩm thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await Category.deleteCategory(id);
    res.json({ message: "Đã xoá danh mục thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error });
  }
};
