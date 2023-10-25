const fs = require("fs");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const cloudinary = require("cloudinary").v2; // NEVER FORGET THE V2

// Get All Users
const getAllUsers = async (req, res) => {
  res.send("GET All Users");
};

// Get User
const getUser = async (req, res) => {
  res.send("GET User");
};

// Create User
const createUser = async (req, res) => {
  const user = await User.create(req.body);

  res.status(StatusCodes.CREATED).json({ user });
};

// Update User
const updateUser = async (req, res) => {
  res.send("UPDATE User");
};

// Delete User
const deleteUser = async (req, res) => {
  res.send("DELETE User");
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
  // fs.unlinkSync(req.files.image.tempFilePath);

  console.log(result);

  res.status(StatusCodes.CREATED).json({
    image: {
      src: result.secure_url,
    },
  });
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
};
