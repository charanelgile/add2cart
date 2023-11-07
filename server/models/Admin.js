const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const AdminSchema = new mongoose.Schema(
  {
    fullName: {
      firstName: {
        type: String,
        required: [true, "Please provide your First Name"],
        maxlength: 60,
      },
      lastName: {
        type: String,
        required: [true, "Please provide your Last Name"],
        maxlength: 60,
      },
    },
    email: {
      type: String,
      required: [true, "Please provide an Email"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid Email",
      ],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a Password"],
      minlength: 8,
    },
    image: {
      type: String,
      default: "http://dummyimage.com/100x100.png/5fa2dd/ffffff",
    },
  },
  { timestamps: true }
);

/*** Encrypt Password ***/
// Use regular function (not arrow function) for the "this" keyword to reference to the Schema in this module / file
AdminSchema.pre("save", async function () {
  // Define the number of salt rounds when encrypting the password
  const salt = await bcrypt.genSalt(10);
  // Encrypt the password
  this.password = await bcrypt.hash(this.password, salt);
});

/*** Generate Token ***/
AdminSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      adminID: this._id,
      adminName: `${this.fullName.firstName} ${this.fullName.lastName}`,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

module.exports = mongoose.model("Admin", AdminSchema);
