const User = require("../models/User");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const { StatusCodes } = require("http-status-codes");

// View Order
const viewOrder = async (req, res) => {
  res.send("View Order");
};

// Confirm Order
const confirmOrder = async (req, res) => {
  const { userID, shippingDetails } = req.body;

  if (!userID) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        message: "Please provide a User ID",
      },
    });
  }

  if (!shippingDetails) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        message: "Please provide the Shipping Details",
      },
    });
  }

  // Find the User based on the User ID
  const user = await User.findById({ _id: userID });

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: {
        message: `User not found`,
      },
    });
  }

  if (user.cart.length === 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        message: `User's cart is empty`,
      },
    });
  }

  // Separate the Items for Checkout from those to remain in the Cart
  const remainInCart = user.cart.filter((item) => {
    return item.checkout === false;
  });

  const itemsForCheckout = user.cart.filter((item) => {
    return item.checkout === true;
  });

  // Check if there are no items for checkout
  if (itemsForCheckout.length === 0) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: {
        message: "No item(s) marked for checkout",
      },
    });
  }

  // Calculate the total amount of the items for checkout
  let totalAmount = itemsForCheckout
    .map((item) => {
      return item.price * item.quantity; // Flatten the array first by getting only the subtotal for every item...
    })
    .reduce((total, current) => {
      return total + current; // ... Then compute the total from the array of subtotals
    });

  // Assign a default value to each Shipping Detail, in case none was specified
  // If name is empty or not specified, assign the User's Name
  if (!shippingDetails.name || shippingDetails.name === "") {
    shippingDetails.name = `${user.fullName.firstName} ${user.fullName.lastName}`;
  }
  // If phone is empty or not specified, assign the User's Phone
  if (!shippingDetails.phone || shippingDetails.phone === "") {
    shippingDetails.phone = user.shippingDetails.phone;
  }
  // If address is empty or not specified, assign the User's Address
  if (!shippingDetails.address || shippingDetails.address === "") {
    shippingDetails.address = user.shippingDetails.address;
  }

  // Update the Cart and Orders in User's record
  user.cart = remainInCart;
  user.orders.push(...itemsForCheckout);

  // Save the changes to User
  await user.save();

  // Create the Order
  const order = await Order.create({
    orderedBy: {
      userID,
      email: user.email,
    },
    items: [...itemsForCheckout],
    totalAmount,
    shippingDetails,
  });

  res.status(StatusCodes.CREATED).json({
    action: "confirm order",
    status: "successful",
    message: "Order successfully created",
    order,
  });
};

// Update Order
const updateOrder = async (req, res) => {
  res.send("Update Order");
};

// Cancel Order
const cancelOrder = async (req, res) => {
  res.send("Cancel Order");
};

module.exports = {
  viewOrder,
  confirmOrder,
  updateOrder,
  cancelOrder,
};
