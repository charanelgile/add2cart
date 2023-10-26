const Cart = require("../models/Cart");
const { StatusCodes } = require("http-status-codes");

// View Cart
const viewCart = async (req, res) => {
  res.send("View Cart");
};

// Add Item to Cart
const addToCart = async (req, res) => {
  res.send("Add to Cart");
};

// Remove Item from Cart
const removeFromCart = async (req, res) => {
  res.send("Remove from Cart");
};

// Increase Item Quantity in Cart
const increaseQuantity = async (req, res) => {
  res.send("Increase Item Quantity");
};

// Decrease Item Quantity in Cart
const decreaseQuantity = async (req, res) => {
  res.send("Decrease Item Quantity");
};

module.exports = {
  viewCart,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
};
