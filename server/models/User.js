const mongoose = require("mongoose");

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
    image: { type: String },
    cart: { type: Array },
    orders: { type: Array },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
