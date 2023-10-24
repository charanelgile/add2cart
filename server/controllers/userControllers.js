const fs = require("fs");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const cloudinary = require("cloudinary").v2; // NEVER FORGET THE V2

// Get All Users
const getAllUsers = async (req, res) => {
  res.send("Get All Users");
};

// Get User
const getUser = async (req, res) => {
  res.send("Get User");
};

// Create User
const createUser = async (req, res) => {
  res.send("Create User");
};

// Update User
const updateUser = async (req, res) => {
  res.send("Update User");
};

// Delete User
const deleteUser = async (req, res) => {
  res.send("Delete User");
};

// Upload User Image
const uploadUserImage = async (req, res) => {
  res.send("Upload User Image");
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
};
