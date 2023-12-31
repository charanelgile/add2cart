const fs = require("fs");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const cloudinary = require("cloudinary").v2; // NEVER FORGET THE V2

// Get All Users
const getAllUsers = async (req, res) => {
  // Ensures that only these queries will be processed
  // Any other queries aside from the ones below will be ignored
  const { firstName, lastName, email, gender, sort, fields } = req.query;

  // Setup an empty queries object
  let queries = {};

  if (email) {
    queries.email = { $regex: email };
  }

  if (gender) {
    queries.gender = { $eq: gender };
  }

  // If nothing was destructured from req.query, then
  // the find() method will only be receiving an empty object,
  // therefore returning all users, instead of throwing an error
  let results = User.find(queries);

  // Filter the results more based on the specified First Name pattern
  if (firstName) {
    results = results.find({
      "fullName.firstName": { $regex: firstName, $options: "i" },
    });
  }

  // Filter the results more based on the specified Last Name pattern
  if (lastName) {
    results = results.find({
      "fullName.lastName": { $regex: lastName, $options: "i" },
    });
  }

  // Sort the filtered results based on the given options
  // Otherwise, set "fullName.lastName" as the default sort order
  if (sort) {
    const sortOptions = sort.split(",").join(" ");
    results = results.sort(sortOptions);
  } else {
    results = results.sort("fullName.lastName");
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

  const users = await results;

  res.status(StatusCodes.OK).json({
    count: users.length,
    users,
  });
};

// Get User
const getUser = async (req, res) => {
  // Destructure the 'id' from req.params and
  // assign it an alias of "userID"
  const { id: userID } = req.params;

  const user = await User.findOne({ _id: userID });

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: {
        message: `No user matches the id: ${userID}`,
      },
    });
  }

  res.status(StatusCodes.OK).json({ user });
};

// Create User
const createUser = async (req, res) => {
  const user = await User.create(req.body);

  res.status(StatusCodes.CREATED).json({ user });
};

// Update User
const updateUser = async (req, res) => {
  const {
    body: {
      fullName: { firstName, lastName },
      gender,
      shippingDetails: { phone, address },
      image,
    },
    params: {
      // Destructure the 'id' from req.params and
      // assign it an alias of "userID"
      id: userID,
    },
  } = req;

  if (!firstName || !lastName) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        message: `${
          !firstName ? "First Name" : "Last Name"
        } cannot be empty / blank`,
      },
    });
  }

  if (!gender) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        message: "Please specify your Gender",
      },
    });
  }

  if (!phone) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        message: "Please provide your Phone Number",
      },
    });
  }

  if (!address) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        message: "Please provide your Address",
      },
    });
  }

  if (!image) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        message: "Please upload an image",
      },
    });
  }

  const user = await User.findByIdAndUpdate({ _id: userID }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: {
        message: `No user matches the id: ${userID}`,
      },
    });
  }

  res.status(StatusCodes.OK).json({
    action: "update user",
    message: "User account successfully updated",
    user: {
      fullname: user.fullName,
      email: user.email,
      gender: user.gender,
      shippingDetails: user.shippingDetails,
      image: user.image,
    },
  });
};

// Delete User
const deleteUser = async (req, res) => {
  // Destructure the 'id' from req.params and
  // assign it an alias of "userID"
  const { id: userID } = req.params;

  const user = await User.findByIdAndRemove({ _id: userID });

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: {
        message: `No user matches the id: ${userID}`,
      },
    });
  }

  res.status(StatusCodes.OK).json({
    action: "delete",
    status: "successful",
    user,
  });
};

// Upload User Image
const uploadUserImage = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath, // Temporary File Path created by the "express-fileupload" package
    {
      use_filename: true,
      folder: "add2cart", // Folder in the Cloudinary Dashboard
    }
  );

  // Prevent 'express-fileupload' from saving temporary files in the "tmp" subfolder
  fs.unlinkSync(req.files.image.tempFilePath);

  console.log(result);

  res.status(StatusCodes.CREATED).json({
    image: {
      src: result.secure_url,
    },
  });
};

// Sign Up User
const signUpUser = async (req, res) => {
  const {
    gender,
    shippingDetails: { phone, address },
  } = req.body;

  if (!gender) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        message: "Please specify your Gender",
      },
    });
  }

  if (!phone) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        message: "Please provide your Phone Number",
      },
    });
  }

  if (!address) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        message: "Please provide your Address",
      },
    });
  }

  const user = await User.create(req.body);

  const token = user.generateToken();

  res.status(StatusCodes.CREATED).json({
    action: "sign up user",
    message: "User sign up successful",
    user: {
      fullname: user.fullName,
      email: user.email,
      gender: user.gender,
      shippingDetails: user.shippingDetails,
      image: user.image,
    },
    token,
  });
};

// Sign In User
const signInUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        message: `${
          !email
            ? "Please provide your email"
            : "Please provide the password"
        }`,
      },
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: {
        message: "User account not found",
      },
    });
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: {
        message: "Incorrect password",
      },
    });
  }

  const token = user.generateToken();

  res.status(StatusCodes.OK).json({
    action: "sign in user",
    message: "User sign in successful",
    user: {
      fullname: user.fullName,
      email: user.email,
      gender: user.gender,
      shippingDetails: user.shippingDetails,
      image: user.image,
    },
    token,
  });
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  signUpUser,
  signInUser,
};
