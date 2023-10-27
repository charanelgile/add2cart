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
    // If a similar product exists, check first if the quantity
    // will not exceed the number of products in stock
    if (similarProduct.quantity + quantity > product.stock) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: {
          message: `Not enough product in stock`,
        },
      });
    }

    // Increase the quantity if a similar product already exists in the cart AND
    // if the similar product's quantity will not exceed the number of products in stock
    similarProduct.quantity += quantity;

    console.log(`Product in Cart: ${similarProduct.quantity}`);
  } else {
    // If a similar product doesn't exist in the cart, check first if the quantity
    // will not exceed the number of products in stock
    if (quantity > product.stock) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: {
          message: `Not enough product in stock`,
        },
      });
    }

    cart.items.push({
      product: productID,
      quantity,
      price: product.price,
    });

    console.log(`Quantity added to Cart: ${quantity}`);
  }

  await product.save();

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
  } else {
    cart.items = cart.items.filter((item) => {
      return item.product.toString() !== productID;
    });
  }

  await cart.save();

  res.status(StatusCodes.OK).json({
    action: "remove item in cart",
    status: "successful",
    message: "Product successfully removed from your cart",
    cart,
  });
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

  res.status(StatusCodes.OK).json({
    action: "increase item quantity",
    status: "successul",
    message: "Product quantity successfully increased",
    cart,
  });
};

// Decrease Item Quantity in Cart
const decreaseQuantity = async (req, res) => {
  // Determinant if the product was removed from the cart
  let notRemoved = true;

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
  } else {
    if (cartItem.quantity > 1) {
      // Decrement the quantity if the product actually exists and is greater than 1
      cartItem.quantity--;
    } else {
      // Otherwise, remove the product in the cart entirely
      cart.items = cart.items.filter((item) => {
        return item.product.toString() !== productID;
      });

      notRemoved = false;
    }
  }

  await cart.save();

  res.status(StatusCodes.OK).json({
    action: `${
      notRemoved ? "decrease item quantity" : "remove item in cart"
    }`,
    status: "successul",
    message: `${
      notRemoved
        ? "Product quantity successfully decreased"
        : "Product successfully removed from your cart"
    }`,
    cart,
  });
};

module.exports = {
  viewCart,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
};
