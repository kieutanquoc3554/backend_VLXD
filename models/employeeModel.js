const db = require("../utils/db");

exports.getAllEmployees = async () => {
  const sql = `SELECT * FROM employees`;
  const [employees] = await db.query(sql);
  return employees;
};

exports.createEmployee = async (name, role, phone, email, passwordHash) => {
  const sql = `INSERT INTO employees (name, role, phone, email, password_hash) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [name, role, phone, email, passwordHash]);
};

exports.getEmployeeByEmail = async (email) => {
  const sql = `SELECT * FROM employees WHERE email = ?`;
  const [row] = await db.query(sql, [email]);
  return row[0];
};

exports.getEmployeeByToken = async (token) => {
  if (!token) {
    throw new Error("Token không hợp lệ!");
  }
  const sql = `SELECT DISTINCT e.id, e.name, e.role, e.phone, e.email FROM employees e  JOIN user_sessions u ON e.id = u.employee_id WHERE u.token = ? LIMIT 1`;
  try {
    const [row] = await db.query(sql, [token]);
    if (row.length === 0) {
      return null;
    }
    return row[0];
  } catch (error) {
    console.error("Lỗi truy vấn getEmployeeByToken:", error);
    throw new Error("Lỗi server khi xác thực token!");
  }
};

exports.createSession = async (employeeId, token, expiresAt) => {
  const sql = `INSERT INTO user_sessions (employee_id, token, expires_at) VALUES (?, ?, ?)`;
  return db.query(sql, [employeeId, token, expiresAt]);
};

exports.getSessionByToken = async (token) => {
  const sql = `SELECT * FROM user_sessions WHERE token = ?`;
  const [row] = await db.query(sql, [token]);
  return row[0];
};

exports.deleteSession = async (token) => {
  const sql = `DELETE FROM user_sessions WHERE token = ?`;
  await db.query(sql, [token]);
};

exports.updateEmployee = async (id, name, role, phone, email) => {
  const sql = `UPDATE employees SET name=?, role=?, phone=?, email=? WHERE id=?`;
  const [result] = await db.query(sql, [name, role, phone, email, id]);
  return result.affectedRows > 0;
};

exports.suspendEmployee = async (id, suspendedUntil, permanently) => {
  try {
    const sql = `UPDATE employees SET suspended_permanently = ?, suspended_until = ? WHERE id = ?`;
    await db.query(sql, [permanently, suspendedUntil, id]);
    return { message: "Nhân viên đã bị đình chỉ" };
  } catch (error) {
    throw new Error("Lỗi khi đình chỉ nhân viên: " + error.message);
  }
};

exports.deleteEmployee = async (id) => {
  try {
    const sql = `UPDATE employees SET deleted = TRUE WHERE id=?`;
    await db.query(sql, [id]);
    return { message: "Đã xóa nhân viên" };
  } catch (error) {
    throw new Error("Lỗi khi xóa nhân viên: ", error.message);
  }
};

exports.restoreEmployee = async (id) => {
  try {
    const sql = `UPDATE employees SET deleted = FALSE WHERE id=?`;
    await db.query(sql, [id]);
    return { message: "Đã khôi phục nhân viên" };
  } catch (error) {
    throw new Error("Lỗi khi khôi phục nhân viên");
  }
};
