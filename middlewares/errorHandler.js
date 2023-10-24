const { StatusCodes } = require("http-status-codes");

const errorHandler = (error, req, res, next) => {
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

  // console.log(error);

  console.log(customError);

  return res.status(customError.statusCode).json({
    error: {
      message: customError.errorMessage,
    },
  });
};

module.exports = errorHandler;
