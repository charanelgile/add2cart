const Product = require("../models/Product");

// Get All Products
const getAllProducts = async (req, res) => {
  res.status(200).send("Get All Products");
};

// Get Product
const getProduct = async (req, res) => {
  res.status(200).send("Get Product");
};

// Create Product
const createProduct = async (req, res) => {
  res.status(200).send("Create Product");
};

// Update Product
const updateProduct = async (req, res) => {
  res.status(200).send("Update Product");
};

// Delete Product
const deleteProduct = async (req, res) => {
  res.status(200).send("Delete Product");
};

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
