const fs = require("fs");
const Admin = require("../models/Admin");
const { StatusCodes } = require("http-status-codes");
const cloudinary = require("cloudinary").v2; // NEVER FORGET THE V2

// Sign Up Admin
const signUpAdmin = async (req, res) => {
  const admin = await Admin.create(req.body);

  const token = admin.generateToken();

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

// Sign In Admin
const signInAdmin = async (req, res) => {
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

  const admin = await Admin.findOne({ email });

  if (!admin) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: {
        message: "Admin account not found",
      },
    });
  }

  const isPasswordCorrect = await admin.comparePassword(password);

  if (!isPasswordCorrect) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: {
        message: "Incorrect password",
      },
    });
  }

  const token = admin.generateToken();

  res.status(StatusCodes.CREATED).json({
    action: "sign in admin",
    message: "Admin sign in successful",
    admin: {
      fullName: admin.fullName,
      email: admin.email,
      image: admin.image,
    },
    token,
  });
};

module.exports = { signUpAdmin, signInAdmin };
