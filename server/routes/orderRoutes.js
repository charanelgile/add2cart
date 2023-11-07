const router = require("express").Router();

// Authentication Middlewares
const authenticateAdmin = require("../middlewares/authenticateAdmin");
const authenticateUser = require("../middlewares/authenticateUser");

// Order Controllers
const {
  viewAllOrders,
  viewOrder,
  confirmOrder,
  updateOrder,
  cancelOrder,
  deleteOrder,
} = require("../controllers/orderControllers");

// View All Orders
router.get("/view", authenticateUser, viewAllOrders); // User-accessible

// View Order
router.get("/view/:id", authenticateUser, viewOrder); // User-accessible

// Confirm Order
router.post("/confirm", authenticateUser, confirmOrder); // User-accessible

// Update Order
router.patch("/update/:id", authenticateUser, updateOrder); // User-accessible

// Cancel Order
router.patch("/cancel/:id", authenticateUser, cancelOrder); // User-accessible

// Delete Order
router.delete("/delete/:id", authenticateAdmin, deleteOrder); // Admin Only

module.exports = router;
