const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    orderedBy: {
      userID: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "A user must be associated with an order"],
      },
      email: {
        type: String,
        required: true,
      },
    },
    items: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: [true, "A product must be associated with an item"],
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
    },
    shippingDetails: {
      recipient: {
        type: String,
        required: [true, "Please provide the name of the recipient"],
      },
      phone: {
        type: String,
        required: [true, "A phone number is required for faster delivery"],
      },
      address: {
        type: String,
        required: [
          true,
          "An address is required for more accurate shipping",
        ],
      },
    },
    status: {
      type: String,
      enum: {
        values: [
          "pending",
          "being prepared",
          "cancelled",
          "on the way",
          "delivered",
        ],
        message: `{VALUE} is not a supported Order Status`,
      },
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
