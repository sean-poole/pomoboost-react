const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");

// Main Routes
router.post("/login", homeController.login);
router.post("/signup", homeController.signup);
router.post("/logout", homeController.logout);

module.exports = router;
