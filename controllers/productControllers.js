const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");

// Get All Products
const getAllProducts = async (req, res) => {
  // Ensures that only these queries will be processed
  // Any other queries aside from the ones below will be ignored
  const {
    name,
    description,
    category,
    subcategory,
    filters,
    sort,
    fields,
  } = req.query;

  // Setup an empty queries object
  let queries = {};

  if (name) {
    queries.name = { $regex: name, $options: "i" };
  }

  if (description) {
    queries.description = { $regex: description, $options: "i" };
  }

  if (category) {
    queries.category = category;
  }

  if (subcategory) {
    queries.subcategory = subcategory;
  }

  // Filter the results based on the specified conditions
  if (filters) {
    // Map out the basic operators to their corresponding mongoose counterparts
    const operators = {
      "=": "$eq",
      ">": "$gt",
      "<": "$lt",
      ">=": "$gte",
      "<=": "$lte",
    };

    // RegEx to extract the operator symbols from the request
    const regex = /\b(>=|>|=|<|<=)\b/g;

    // Replace any matching operator symbol with a pattern that uses its mongoose counterpart: -$<mongoose_operator>-
    let numericFilters = filters.replace(regex, (match) => {
      return `-${operators[match]}-`;
    });

    // Define the filter options where the numeric filters can be used
    const filterOptions = ["price", "stock", "rating"];

    // Split the numeric filters at every "," then
    // Iterate over the resulting array of filter options
    numericFilters = numericFilters.split(",").forEach((option) => {
      // Split the filter option at every "-" then
      // Destructure them into field, operator, and value
      const [field, operator, value] = option.split("-");

      if (filterOptions.includes(field)) {
        // If the destructured field matches any of the filter options (price, stock, or rating),
        // add it as a property of the queries object
        // Example:  queries.price: { $gte: 35 }
        queries[field] = {
          [operator]: Number(value),
        };
      }
    });
  }

  // If nothing was destructured from req.query, then
  // the find() method will only be receiving an empty object,
  // therefore returning all products, instead of throwing an error
  let results = Product.find(queries);

  // Sort the results based on the given options
  // Otherwise, set "createdAt" as the default sort order
  if (sort) {
    const sortOptions = sort.split(",").join(" ");
    results = results.sort(sortOptions);
  } else {
    results = results.sort("createdAt");
  }

  // Show only the specified / selected fields
  if (fields) {
    const selectedFields = fields.split(",").join(" ");
    results = results.select(selectedFields);
  }

  // Set Page (defaults to 1, when not specified)
  const page = Number(req.query.page) || 1;
  // Set Limit (defaults to 10, when not specified)
  const limit = Number(req.query.limit) || 10;

  // Calculate how many items will be skipped based on the specified page and limit
  // This will determine the pagination
  const skip = (page - 1) * limit;

  results = results.skip(skip).limit(limit);

  const products = await results;

  res.status(StatusCodes.OK).json({
    count: products.length,
    products,
  });
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
