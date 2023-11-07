const router = require("express").Router();

// Authentication Middlewares
const authenticateAdmin = require("../middlewares/authenticateAdmin");
const authenticateUser = require("../middlewares/authenticateUser");

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
  .patch(authenticateUser, updateUser) // User-accessible
  .delete(authenticateAdmin, deleteUser); // Admin Only

router.post("/uploads", authenticateUser, uploadUserImage); // User-accessible

module.exports = router;
