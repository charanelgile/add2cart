const router = require("express").Router();
const {
  viewCart,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} = require("../controllers/cartControllers");

// View Cart
router.get("/view", viewCart);

// Add Item to Cart
router.post("/add", addToCart);

// Remove Item from Cart
router.delete("/remove/:id", removeFromCart);

// Increase Item Quantity in Cart
router.patch("/increase/:id", increaseQuantity);

// Decrease Item Quantity in Cart
router.patch("/decrease/:id", decreaseQuantity);

module.exports = router;
