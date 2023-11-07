const router = require("express").Router();
const {
  signUpAdmin,
  signInAdmin,
} = require("../controllers/adminControllers");

router.post("/sign-up", signUpAdmin);
router.post("/sign-in", signInAdmin);

module.exports = router;
