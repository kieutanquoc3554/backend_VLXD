const db = require("../utils/db");

exports.getAllCategories = async () => {
  const [categories] = await db.query(`SELECT * FROM categories`);
  return categories;
};

exports.getCategoryById = async (id) => {
  const [category] = await db.query(`SELECT * FROM categories WHERE id=?`, [
    id,
  ]);
  return category[0];
};

exports.createCategory = async (name, description) => {
  await db.query(`INSERT INTO categories (name, description) VALUES (?, ?)`, [
    name,
    description,
  ]);
};

exports.updateCategory = async (id, name, description, disabled, deleted) => {
  await db.query(
    "UPDATE categories SET name=?, description=?, disabled=?, deleted=? WHERE id=?",
    [name, description, disabled, deleted, id]
  );
};

exports.deleteCategory = async (id) => {
  await db.query("DELETE FROM categories WHERE id=?", [id]);
};
