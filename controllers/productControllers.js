const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");

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
  try {
    const product = await Product.create(req.body);

    res.status(StatusCodes.CREATED).json({ product });
  } catch (error) {
    let customError = {
      statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      errorMessage:
        error.message || "Something went wrong. Try again later.",
    };

    if (error.name === "ValidationError") {
      // Set the Status Code to 400 - Bad Request
      customError.statusCode = 400;
      // Combine the values of every "message" property under "error.errors"
      customError.errorMessage = Object.values(error.errors)
        .map((err) => err.message)
        .join(". ");
    }

    if (error.code && error.code === 11000) {
      // Set the Status Code to 400 - Bad Request
      customError.statusCode = 400;
      // Combine every key under "error.keyValue"
      customError.errorMessage = `Duplicate value entered for ${Object.keys(
        err.keyValue
      )} field. Please choose another value.`;
    }

    if (error.name === "CastError") {
      // Set the Status Code to 404 - Not Found
      customError.statusCode = 404;
      customError.errorMessage = `No item matching the id: ${error.value}`;
    }

    console.log(error);

    console.log(customError);

    return res.status(customError.statusCode).json({
      error: {
        message: customError.errorMessage,
      },
    });
  }
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
