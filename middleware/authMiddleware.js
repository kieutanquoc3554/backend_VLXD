const jwt = require("jsonwebtoken");
const employeeModel = require("../models/employeeModel");

exports.authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
  }
  try {
    const session = await employeeModel.getSessionByToken(token);
    if (!session) {
      return res
        .status(403)
        .json({ message: "Session hết hạn hoặc không hợp lệ!" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Token không hợp lệ!" });
  }
};
