require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const customerRoutes = require("./routes/customerRoutes");
const productRoutes = require("./routes/productRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const debtRoutes = require("./routes/debtRoutes");
const billRoutes = require("./routes/billRoutes");
const express = require("express");
const cors = require("cors");
const db = require("./utils/db");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const upload = require("./middleware/upload");
const cloudinary = require("./utils/cloudinary");

const isProduction = process.env.NODE_ENV === "production";
const app = express();
app.use(
  cors({
    origin: isProduction
      ? "https://frontend-vlxd.vercel.app"
      : "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/debt", debtRoutes);
app.use("/api/bill", billRoutes);

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "uploads",
    });
    fs.unlinkSync(req.file.path);
    res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/ping", async (req, res) => {
  try {
    const [row] = await db.query('SELECT "Database Connected" AS message');
    res.json(row[0]);
  } catch (error) {
    res.status(500).json({ error: "Lỗi kết nối database" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
