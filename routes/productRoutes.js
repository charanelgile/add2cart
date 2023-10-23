const router = require("express").Router();
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

module.exports = router;
