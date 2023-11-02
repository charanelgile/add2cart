const router = require("express").Router();
const {
  viewEveryonesOrders,
  viewUsersOrders,
  viewSingleOrder,
  confirmOrder,
  updateOrder,
  cancelOrder,
} = require("../controllers/orderControllers");

// View Everyone's Orders
router.get("/view/everyone", viewEveryonesOrders);

// View User's Orders
router.get("/view/user/:id", viewUsersOrders);

// View Single Order
router.get("/view/single/:id", viewSingleOrder);

// Confirm Order
router.post("/confirm", confirmOrder);

// Update Order
router.patch("/update/:id", updateOrder);

// Cancel Order
router.delete("/cancel/:id", cancelOrder);

module.exports = router;
