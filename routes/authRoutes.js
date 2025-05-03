const express = require("express");
const authController = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authController.getEmployees);
router.get("/me", authMiddleware, authController.getSessionUser);
router.post("/update/:id", authController.updateEmployee);
router.post("/register", authController.register);
router.put("/suspend/:id", authController.suspendEmployee);
router.post("/delete/:id", authMiddleware, authController.deleteEmployee);
router.post("/restore/:id", authController.restoreEmployee);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/check-auth", authMiddleware, authController.checkAuth);
router.get("/user", authController.getUserInfo);
router.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Thông tin nhân viên", user: req.user });
});

module.exports = router;
