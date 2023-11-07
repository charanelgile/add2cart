const router = require("express").Router();

// Authentication Middlewares
const authenticateAdmin = require("../middlewares/authenticateAdmin");

// User Controllers
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
} = require("../controllers/userControllers");

router
  .route("/")
  .get(authenticateAdmin, getAllUsers) // Admin Only
  .post(authenticateAdmin, createUser); // Admin Only

router
  .route("/:id")
  .get(authenticateAdmin, getUser) // Admin Only
  .patch(updateUser)
  .delete(authenticateAdmin, deleteUser); // Admin Only

router.post("/uploads", uploadUserImage);

module.exports = router;
