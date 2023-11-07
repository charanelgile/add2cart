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
  signUpUser,
  signInUser,
} = require("../controllers/userControllers");

router
  .route("/")
  .get(authenticateAdmin, getAllUsers) // Admin Only
  .post(authenticateAdmin, createUser); // Admin Only

router
  .route("/:id")
  .get(authenticateAdmin, getUser) // Admin Only
  .delete(authenticateAdmin, deleteUser); // Admin Only

router.patch("/update/:id", authenticateUser, updateUser); // User-accessible
router.post("/uploads", authenticateUser, uploadUserImage); // User-accessible

router.post("/sign-up", signUpUser);
router.post("/sign-in", signInUser);

module.exports = router;
