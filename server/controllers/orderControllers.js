const User = require("../models/User");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const { StatusCodes } = require("http-status-codes");

// View All Orders
const viewAllOrders = async (req, res) => {
  // Destructure the query parameters
  const { status, orderedBy, sort, fields } = req.query;

  // Setup an empty query parameters object
  let queries = {};

  // Filter the results based on the status
  if (status) {
    queries.status = { $eq: status };
  }

  // If no status filter was given, then
  // the find() method will only be receiving an empty object,
  // therefore returning all orders, instead of throwing an error
  let results = Order.find(queries);

  // Filter the results even more to show only the orders
  // made by the same User through their Email
  if (orderedBy) {
    results = results.find({
      "orderedBy.email": { $eq: orderedBy },
    });
  }

  // Sort the filtered results based on the given options ...
  if (sort) {
    const sortOptions = sort.split(",").join(" ");
    results = results.sort(sortOptions);
  } else {
    // ... Otherwise, set "createdAt" (newest to oldest) as the default sort order
    results = results.sort("-createdAt");
  }

  // Show only the specified / selected fields
  if (fields) {
    const selectedFields = fields.split(",").join(" ");
    results = results.select(selectedFields);
  }

  // Set Page (defaults to 1, when not specified)
  const page = Number(req.query.page) || 1;
  // Set Limit (defaults to 10, when not specified)
  const limit = Number(req.query.limit) || 10;

  // Calculate how many items will be skipped based on the specified page and limit
  // This will determine the pagination
  const skip = (page - 1) * limit;

  results = results.skip(skip).limit(limit);

  const orders = await results;

  if (!orders) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: {
        message: "No orders found",
      },
    });
  }

  res.status(StatusCodes.OK).json({
    count: orders.length,
    orders,
  });
};

// View Order
const viewOrder = async (req, res) => {
  // Destructure the id from req.params
  // Then assign it an alias of "orderID"
  const { id: orderID } = req.params;

  const order = await Order.findById({ _id: orderID });

  if (!order) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: {
        message: "Order not found",
      },
    });
  }

  res.status(StatusCodes.OK).json({ order });
};

// Confirm Order
const confirmOrder = async (req, res) => {
  const { userID, shippingDetails } = req.body;

  if (!userID) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        message: "Please provide the User ID",
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
  // Find the Cart based on the User ID
  const cart = await Cart.findOne({ owner: userID });

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: {
        message: `User not found`,
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

  if (cart.items.length === 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        message: `User's cart is empty`,
      },
    });
  }

  // Separate the Items for Checkout from those to remain in the Cart
  const remainInCart = cart.items.filter((item) => {
    return item.checkout === false;
  });

  const itemsForCheckout = cart.items.filter((item) => {
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
      return item.price * item.quantity; // Flatten the array first by getting only the subtotal for every item ...
    })
    .reduce((total, current) => {
      return total + current; // ... Then compute the total from the array of subtotals
    });

  // Assign a default value to each Shipping Detail, in case none was specified
  // If name is empty or not specified, assign the User's Name
  if (!shippingDetails.recipient || shippingDetails.recipient === "") {
    shippingDetails.recipient = `${user.fullName.firstName} ${user.fullName.lastName}`;
  }
  // If phone is empty or not specified, assign the User's Phone
  if (!shippingDetails.phone || shippingDetails.phone === "") {
    shippingDetails.phone = user.shippingDetails.phone;
  }
  // If address is empty or not specified, assign the User's Address
  if (!shippingDetails.address || shippingDetails.address === "") {
    shippingDetails.address = user.shippingDetails.address;
  }

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

  // Update the Items in the User's Cart
  cart.items = [...remainInCart];

  // Save the changes to User
  await cart.save();

  res.status(StatusCodes.CREATED).json({
    action: "confirm order",
    status: "successful",
    message: "Order successfully created",
    order,
  });
};

// Update Order
const updateOrder = async (req, res) => {
  /*
    Properties that can be updated in an order:
    - recipient
    - phone
    - address
    - status
    - items for checkout
      - increase / decrease in item quantity
        - when increasing:
          - update the product in stock
          - update the total amount
        - when decreasing:
          - update the product in stock
          - update the total amount
          - if decreased to 0
            - remove the product in the array and
            - update the items for checkout
            - update the product in stock
            - update the total amount
      - remove a particular product in the items for checkout
        - update the items for checkout
        - update the product in stock
        - update the total amount
  */

  res.send("Update Order");
};

// Cancel Order
const cancelOrder = async (req, res) => {
  res.send("Cancel Order");
};

module.exports = {
  viewAllOrders,
  viewOrder,
  confirmOrder,
  updateOrder,
  cancelOrder,
};
