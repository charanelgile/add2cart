const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");

// View Order
const viewOrder = async (req, res) => {
  res.send("View Order");
};

// Confirm Order
const confirmOrder = async (req, res) => {
  res.send("Confirm Order");
};

// Update Order
const updateOrder = async (req, res) => {
  res.send("Update Order");
};

// Cancel Order
const cancelOrder = async (req, res) => {
  res.send("Cancel Order");
};

module.exports = {
  viewOrder,
  confirmOrder,
  updateOrder,
  cancelOrder,
};
