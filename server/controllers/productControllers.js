const fs = require("fs");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const cloudinary = require("cloudinary").v2; // NEVER FORGET THE V2

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
  // Destructure the 'id' from req.params and
  // assign it an alias of "productID"
  const { id: productID } = req.params;

  const product = await Product.findOne({ _id: productID });

  if (!product) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: {
        message: `No product matches the id: ${productID}`,
      },
    });
  }

  res.status(StatusCodes.OK).json({ product });
};

// Create Product
const createProduct = async (req, res) => {
  const product = await Product.create(req.body);

  res.status(StatusCodes.CREATED).json({ product });
};

// Update Product
const updateProduct = async (req, res) => {
  const {
    body: {
      name,
      description,
      category,
      subcategory,
      price,
      images,
      stock,
      rating,
    },
    params: {
      // Destructure the 'id' from req.params and
      // assign it an alias of "productID"
      id: productID,
    },
  } = req;

  if (name === "") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        message: "Product Name cannot be empty",
      },
    });
  }

  if (description === "") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        message: "Please do not leave the Product Description empty",
      },
    });
  }

  if (category === "") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        message: "Please do not leave the Product Category empty",
      },
    });
  }

  if (subcategory === "") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        message: "Product Subcategory cannot be empty",
      },
    });
  }

  if (price === "") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        message: "Invalid Product Price value",
      },
    });
  } else if (price < 1) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        message: "Product Price cannot be zero",
      },
    });
  }

  if (images === "") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        message: "Product must have at least one image",
      },
    });
  }

  if (stock < 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        message: "Product Stock cannot be lower than zero",
      },
    });
  } else if (stock === "") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        message: "Invalid Product Stock value",
      },
    });
  }

  if (rating < 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        message: "Product Rating cannot be lower than zero",
      },
    });
  } else if (rating === "") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        message: "Invalid Product Rating value",
      },
    });
  }

  const product = await Product.findByIdAndUpdate(
    { _id: productID },
    req.body,
    { new: true, runValidators: true } // This will ensure that the API Endpoint will return the updated Product Details
  );

  if (!product) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: {
        message: `No product matches the id: ${productID}`,
      },
    });
  }

  res
    .status(StatusCodes.OK)
    .json({ action: "update", status: "successful", product });
};

// Delete Product
const deleteProduct = async (req, res) => {
  // Destructure the 'id' from req.params and
  // assign it an alias of "productID"
  const { id: productID } = req.params;

  const product = await Product.findByIdAndRemove({ _id: productID });

  if (!product) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: {
        message: `No product matches the id: ${productID}`,
      },
    });
  }

  res
    .status(StatusCodes.OK)
    .json({ action: "delete", status: "successful", product });
};

// Upload Product Image (Cloudinary)
const uploadProductImage = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath, // Temporary File Path created by the "express-fileupload" package
    {
      use_filename: true,
      folder: "add2cart", // Folder in the Cloudinary Dashboard
    }
  );

  // Prevent 'express-fileupload' from saving temporary files in the "tmp" subfolder
  fs.unlinkSync(req.files.image.tempFilePath);

  return res.status(StatusCodes.CREATED).json({
    image: {
      src: result.secure_url,
    },
  });
};

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
};
