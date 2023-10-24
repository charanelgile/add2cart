const router = require("express").Router();
const { uploadProductImage } = require("../controllers/uploadControllers");
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productControllers");

router.route("/").get(getAllProducts).post(createProduct);

router
  .route("/:id")
  .get(getProduct)
  .patch(updateProduct)
  .delete(deleteProduct);

router.post("/uploads", uploadProductImage);

module.exports = router;
