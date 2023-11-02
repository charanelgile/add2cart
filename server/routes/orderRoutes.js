const router = require("express").Router();
const {
  viewAllOrders,
  viewOrder,
  confirmOrder,
  updateOrder,
  cancelOrder,
} = require("../controllers/orderControllers");

// View All Orders
router.get("/view", viewAllOrders);

// View Order
router.get("/view/:id", viewOrder);

// Confirm Order
router.post("/confirm", confirmOrder);

// Update Order
router.patch("/update/:id", updateOrder);

// Cancel Order
router.delete("/cancel/:id", cancelOrder);

module.exports = router;
