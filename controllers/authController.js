const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const employeeModel = require("../models/employeeModel");
const db = require("../utils/db");
const { format } = require("date-fns");

exports.getSessionUser = (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Chưa đăng nhập" });
  }
};

exports.register = async (req, res) => {
  const { name, role, phone, email, password } = req.body;
  try {
    const existingEmployee = await employeeModel.getEmployeeByEmail(email);
    if (existingEmployee) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    await employeeModel.createEmployee(name, role, phone, email, passwordHash);
    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const now = new Date();
    const employee = await employeeModel.getEmployeeByEmail(email);
    if (!employee)
      return res.status(400).json({ message: "Email không tồn tại" });
    if (employee.suspended_permanently) {
      return res
        .status(403)
        .json({ message: "Tài khoản bị đình chỉ vĩnh viễn." });
    }
    if (employee.suspended_until && new Date(employee.suspended_until) > now) {
      const suspendedUntil = format(
        new Date(employee.suspended_until),
        "dd/MM/yyyy HH:mm"
      );
      return res.status(403).json({
        message: `Tài khoản bị đình chỉ đến ${suspendedUntil}`,
      });
    }

    const isMatch = await bcrypt.compare(password, employee.password_hash);
    if (!isMatch)
      return res.status(401).json({ message: "Mật khẩu không đúng" });
    const token = jwt.sign(
      { id: employee.id, role: employee.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    await employeeModel.createSession(
      employee.id,
      token,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ message: "Đăng nhập thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error });
  }
};

exports.logout = async (req, res) => {
  try {
    await employeeModel.deleteSession(req.cookies.token);
    res.clearCookie("token");
    res.json({ message: "Đăng xuất thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.checkAuth = async (req, res) => {
  if (!req.cookies.token) {
    return res.status(401).json({ message: "Chưa đăng nhập" });
  }
  res.json({ message: "Đã đăng nhập" });
};

exports.getUserInfo = async (req, res) => {
  try {
    const user = await employeeModel.getEmployeeByToken(req.cookies.token);
    if (!user) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }
    res.json({ name: user.name });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getEmployees = async (req, res) => {
  try {
    const employees = await employeeModel.getAllEmployees();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json("Lỗi server!" + error);
  }
};

exports.updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { name, role, phone, email } = req.body;
  try {
    const response = await employeeModel.updateEmployee(
      id,
      name,
      role,
      phone,
      email
    );
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" + error });
  }
};

exports.getAllEmployeesRole = async (req, res) => {
  try {
    const { table, column } = req.params;
    const [rows] = await db.execute(
      `SHOW COLUMNS \`${table}\` WHERE Field = ?`,
      [column]
    );
    if (!rows.length) {
      res.status(404).json({ message: "Không tìm thấy chức danh nhân viên" });
    }
  } catch (error) {}
};

exports.suspendEmployee = async (req, res) => {
  const { id } = req.params;
  const { suspended_permanently, suspended_until } = req.body;

  try {
    let suspendedUntil = null;

    if (!suspended_permanently && suspended_until) {
      suspendedUntil = new Date(suspended_until);
    }

    await employeeModel.suspendEmployee(
      id,
      suspendedUntil,
      suspended_permanently
    );

    res.json({
      message: "Nhân viên đã bị đình chỉ!",
      id,
      suspendedUntil,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    await employeeModel.deleteEmployee(id);
    res.status(200).json({ message: "Đã xóa nhân viên!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
};

exports.restoreEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    await employeeModel.restoreEmployee(id);
    res.status(200).json({ message: "Khôi phục thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
};
