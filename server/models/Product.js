const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide the Product Name"],
      maxlength: 120,
    },
    category: {
      type: String,
      enum: {
        values: ["unisex", "men", "women", "kids"],
        message: `{VALUE} is not a supported Category`,
      },
      default: "Unisex",
    },
    subcategory: {
      type: String,
      enum: {
        values: [
          "tops",
          "bottoms",
          "outerwear",
          "innerwear",
          "loungewear",
          "sportswear",
          "accessories",
          "others",
        ],
        message: `{VALUE} is not a supported Subcategory`,
      },
      required: [true, "Please provide the Product Subcategory"],
    },
    description: {
      type: String,
      maxlength: 350,
    },
    price: {
      type: Number,
      required: [true, "Please set the Product Price"],
    },
    images: [
      {
        src: {
          type: String,
          required: [true, "Please provide at least one Product Image"],
        },
      },
    ],
    stock: {
      type: Number,
      default: 10,
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
