const router = require("express").Router();
const { signUpAdmin } = require("../controllers/adminControllers");

router.post("/sign-up", signUpAdmin);

module.exports = router;
