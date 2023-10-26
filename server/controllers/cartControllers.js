const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");

// View Cart
const viewCart = async (req, res) => {
  const { id: userID } = req.params;

  const cart = await Cart.findOne({ owner: userID });

  if (!cart) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: {
        message: `Cart not found`,
      },
    });
  }

  res.status(StatusCodes.OK).json({ cart });
};

// Add Item to Cart
const addToCart = async (req, res) => {
  const { userID, productID, quantity } = req.body;

  // Find the Product based on the Product ID
  const product = await Product.findById(productID);

  if (!product) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: {
        message: `Product not found`,
      },
    });
  }

  // Find the User's Cart based on the User ID
  let cart = await Cart.findOne({ owner: userID });

  // If User doesn't have a Cart yet, then create one for them
  if (!cart) {
    cart = new Cart({ owner: userID, items: [] });
  }

  // If User already has a Cart, then check if it contains
  // a product similar to the one being added
  const similarProduct = cart.items.find((item) => {
    return item.product.toString() === productID;
  });

  if (similarProduct) {
    // Increase the quantity if a similar product already exists in the cart
    similarProduct.quantity += quantity;
  } else {
    // Otherwise, just add the product
    cart.items.push({
      product: productID,
      quantity,
      price: product.price,
    });
  }

  await cart.save();

  res.status(StatusCodes.CREATED).json({
    action: "add to cart",
    status: "successul",
    message: "Product successfully added to your cart",
    cart,
  });
};

// Remove Item from Cart
const removeFromCart = async (req, res) => {
  res.send("Remove from Cart");
};

// Increase Item Quantity in Cart
const increaseQuantity = async (req, res) => {
  const {
    body: { userID },
    params: { id: productID },
  } = req;

  // Find the User's Cart based on the User ID
  const cart = await Cart.findOne({ owner: userID });

  if (!cart) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: {
        message: `Cart not found`,
      },
    });
  }

  // Find the particular product in the Cart using the Product ID
  const cartItem = cart.items.find((item) => {
    return item.product.toString() === productID;
  });

  if (!cartItem) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: {
        message: `There's no such product in the cart`,
      },
    });
  }

  // Increment the quantity if the product actually exists
  cartItem.quantity++;

  await cart.save();

  res.status(StatusCodes.CREATED).json({
    action: "increase item quantity",
    status: "successul",
    message: "Product quantity successfully increase",
    cart,
  });
};

// Decrease Item Quantity in Cart
const decreaseQuantity = async (req, res) => {
  res.send("Decrease Item Quantity");
};

module.exports = {
  viewCart,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
};