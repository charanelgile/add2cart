const router = require("express").Router();

// Authentication Middlewares
const authenticateAdmin = require("../middlewares/authenticateAdmin");

// Product Controllers
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} = require("../controllers/productControllers");

router
  .route("/")
  .get(getAllProducts)
  .post(authenticateAdmin, createProduct); // Admin Only

router
  .route("/:id")
  .get(getProduct)
  .patch(authenticateAdmin, updateProduct) // Admin Only
  .delete(authenticateAdmin, deleteProduct); // Admin Only

router.post("/uploads", authenticateAdmin, uploadProductImage); // Admin Only

module.exports = router;
