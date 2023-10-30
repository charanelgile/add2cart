const router = require("express").Router();
const {
  viewOrder,
  confirmOrder,
  updateOrder,
  cancelOrder,
} = require("../controllers/orderControllers");

// View Order
router.get("/view/:id", viewOrder);

// Confirm Order
router.post("/confirm", confirmOrder);

// Update Order
router.patch("/update/:id", updateOrder);

// Cancel Order
router.delete("/cancel/:id", cancelOrder);

module.exports = router;
