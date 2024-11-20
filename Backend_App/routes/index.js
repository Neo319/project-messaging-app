const express = require("express");

const indexController = require("../controllers/indexController");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to project Message board (WIP)");
});

router.get("/signup", indexController.signup_get);

router.post("/signup", indexController.signup_post);

router.post("/login", indexController.login_post);

// router.get("/dashboard");

module.exports = router;
