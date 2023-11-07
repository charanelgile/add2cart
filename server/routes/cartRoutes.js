const router = require("express").Router();

// Authentication Middlewares
const authenticateUser = require("../middlewares/authenticateUser");

// Cart Controllers
const {
  viewCart,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} = require("../controllers/cartControllers");

// View Cart
router.get("/view/:id", authenticateUser, viewCart); // User-accessible

// Add Item to Cart
router.post("/add", authenticateUser, addToCart); // User-accessible

// Remove Item from Cart
router.delete("/remove/:id", authenticateUser, removeFromCart); // User-accessible

// Increase Item Quantity in Cart
router.patch("/increase/:id", authenticateUser, increaseQuantity); // User-accessible

// Decrease Item Quantity in Cart
router.patch("/decrease/:id", authenticateUser, decreaseQuantity); // User-accessible

module.exports = router;
