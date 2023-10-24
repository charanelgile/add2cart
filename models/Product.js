const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide the Product Name"],
      maxlength: 120,
    },
    description: {
      type: String,
      maxlength: 350,
    },
    category: {
      type: String,
      enum: {
        values: ["Unisex", "Men", "Women", "Kids"],
        message: `{VALUE} is not a supported Category`,
      },
      default: "Unisex",
    },
    subcategory: {
      type: String,
      enum: {
        values: [
          "Tops",
          "Bottoms",
          "Outerwear",
          "Innerwear",
          "Loungewear",
          "Sportswear",
          "Accessories",
        ],
        message: `{VALUE} is not a supported Subcategory`,
      },
      required: [true, "Please provide the Product Subcategory"],
    },
    price: {
      type: Number,
      required: [true, "Please set the Product Price"],
    },
    images: {
      type: Array,
      required: [true, "Please provide Product Images"],
    },
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
