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
  let { userID, productID, quantity, checkout } = req.body;

  if (!userID || userID === "") {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: {
        message: `Please provide a User ID`,
      },
    });
  }

  if (!productID || productID === "") {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: {
        message: `Please provide the Product ID`,
      },
    });
  }

  //Check if the specified quantity is zero
  if (quantity == 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        message: `Product Quantity cannot be zero`,
      },
    });
  }

  // Find the Product based on the Product ID
  let product = await Product.findById({ _id: productID });

  // Find the User's Cart based on the User ID
  let cart = await Cart.findOne({ owner: userID });

  if (!product) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: {
        message: `Product not found`,
      },
    });
  }

  // If User doesn't have a Cart yet, then create one for them
  if (!cart) {
    cart = new Cart({ owner: userID, items: [] });
  }

  // Check if the quantity will exceed the number of products in stock
  if (Number(quantity) > product.stock) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        message: `Not enough product in stock`,
      },
    });
  } else {
    // If the quantity will not exceed the number of products in stock,
    // check if the User's Cart already contains a product similar to the one being added
    const similarProduct = cart.items.find((item) => {
      return item.product.toString() === productID;
    });

    if (similarProduct) {
      // Just increase the quantity if a similar product already exists in the cart
      similarProduct.quantity += Number(quantity);

      // Update the checkout flag, as well, if specified
      similarProduct.checkout = Boolean(checkout);
    } else {
      // Otherwise, add the item as a new product in the cart
      cart.items.push({
        product: productID,
        quantity: Number(quantity),
        price: product.price,
        checkout: Boolean(checkout),
      });
    }
  }

  // Update the Product in Stock
  product.stock = product.stock - Number(quantity);

  // Save all the changes made in the Cart and Product
  await cart.save();
  await product.save();

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

  if (!userID || userID === "") {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: {
        message: `Please provide a User ID`,
      },
    });
  }

  // Find the Product based on the Product ID
  let product = await Product.findById({ _id: productID });

  // Find the User's Cart based on the User ID
  let cart = await Cart.findOne({ owner: userID });

  if (!product) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: {
        message: `Product not found`,
      },
    });
  }

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
    // Return the quantity back into the Product in Stock
    const returnQuantity = cart.items.find((item) => {
      return item.product.toString() === productID;
    });

    // Update the Product in Stock
    product.stock += returnQuantity.quantity;

    // Remove the product in the Cart
    cart.items = cart.items.filter((item) => {
      return item.product.toString() !== productID;
    });
  }

  // Save all the changes made in the Cart and Product
  await cart.save();
  await product.save();

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

  if (!userID || userID === "") {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: {
        message: `Please provide a User ID`,
      },
    });
  }

  // Find the Product based on the Product ID
  let product = await Product.findById({ _id: productID });

  // Find the User's Cart based on the User ID
  let cart = await Cart.findOne({ owner: userID });

  if (!product) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: {
        message: `Product not found`,
      },
    });
  }

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

  // If the product actually exists, then
  // Check if there are no more products in stock
  if (product.stock === 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        message: `No more stock left for this product`,
      },
    });
  } else {
    // Increment the quantity if the number of products in stock is greater than zero
    cartItem.quantity++;

    // Update the Product in Stock
    product.stock--;
  }

  // Save all the changes made in the Cart and Product
  await cart.save();
  await product.save();

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

  if (!userID || userID === "") {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: {
        message: `Please provide a User ID`,
      },
    });
  }

  // Find the Product based on the Product ID
  let product = await Product.findById({ _id: productID });

  // Find the User's Cart based on the User ID
  let cart = await Cart.findOne({ owner: userID });

  if (!product) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: {
        message: `Product not found`,
      },
    });
  }

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
      // Otherwise, remove the product from the cart entirely
      cart.items = cart.items.filter((item) => {
        return item.product.toString() !== productID;
      });

      notRemoved = false;
    }

    // Update the Product in Stock
    product.stock++;
  }

  // Save all the changes made in the Cart and Product
  await cart.save();
  await product.save();

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
