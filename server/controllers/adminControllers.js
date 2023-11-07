const fs = require("fs");
const Admin = require("../models/Admin");
const { StatusCodes } = require("http-status-codes");
const cloudinary = require("cloudinary").v2; // NEVER FORGET THE V2

// Sign Up Admin
const signUpAdmin = async (req, res) => {
  const admin = await Admin.create(req.body);

  const token = await admin.generateToken();

  res.status(StatusCodes.CREATED).json({
    action: "sign up admin",
    message: "Admin sign up successful",
    admin: {
      fullName: admin.fullName,
      email: admin.email,
      image: admin.image,
    },
    token,
  });
};

module.exports = { signUpAdmin };
