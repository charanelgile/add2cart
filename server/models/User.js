const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
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
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: `{VALUE} is not a supported Gender`,
      },
    },
    shippingDetails: {
      phone: { type: String },
      address: { type: String },
    },
    image: {
      type: String,
      default: "http://dummyimage.com/100x100.png/5fa2dd/ffffff",
    },
  },
  { timestamps: true }
);

/*** Encrypt Password ***/
UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
});

/*** Compare Password ***/
UserSchema.methods.comparePassword = async function (candidatePassword) {
  const didPasswordsMatch = bcrypt.compare(
    candidatePassword,
    this.password
  );

  return didPasswordsMatch;
};

/*** Generate Token ***/
UserSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      userID: this._id,
      userName: `${this.fullName.firstName} ${this.fullName.lastName}`,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

module.exports = mongoose.model("User", UserSchema);
