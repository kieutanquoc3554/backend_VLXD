const db = require("../utils/db");

exports.getAllDebts = async () => {
  const sql = `SELECT o.id AS order_id, c.id AS customer_id, c.name AS customer_name, o.total_price,
  o.paid_amount, (o.total_price - o.paid_amount) AS remaining_debt, o.order_date
  FROM orders o 
  JOIN customer c ON o.customer_id = c.id
  ORDER BY o.order_date DESC`;
  const [debt] = await db.query(sql);
  return debt;
};

exports.getDebtsByOrderId = async (order_id) => {
  const orderSql = `SELECT o.*, c.name AS customer_name, c.phone AS customer_phone, p.payment_method
                    FROM orders o 
                    JOIN customer c ON o.customer_id = c.id
                    JOIN payments p ON p.order_id = o.id
                    WHERE o.id = ?`;
  const [order] = await db.query(orderSql, [order_id]);
  const detailOrderSql = `SELECT oi.quantity, p.name AS product_name, 
                          ct.name AS product_category, s.name AS product_supplier, 
                          p.price, p.image_url, (oi.quantity * p.price) AS total_price
                          FROM order_items oi 
                          JOIN products p ON oi.product_id = p.id
                          JOIN categories ct ON ct.id = p.category_id
                          JOIN suppliers s ON s.id = p.supplier_id
                          WHERE oi.order_id = ?`;
  const [items] = await db.query(detailOrderSql, [order_id]);
  const historyDebtSql = `SELECT * FROM payments WHERE order_id = ?`;
  const [history] = await db.query(historyDebtSql, [order_id]);
  const debtMap = order.map((o) => {
    return { ...o, items, history };
  });
  return debtMap[0];
};
