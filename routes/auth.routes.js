const express = require("express");
const authController = require("../controllers/auth_controller");
const router = express.Router();

// Auth routes
router.get("/login", (req, res) => {
  res.render("login");
});

// router.get("/create-admin", authController.logout);
// router.get("/create-user", authController.logout);

router.get("/logout", authController.logout);
router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
