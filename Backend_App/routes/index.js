const express = require("express");

const indexController = require("../controllers/indexController");
const router = express.Router();

router.get("/", (req, res) => {
  res.send({
    server_status: "ok",
    message: "Welcome to Project Message Board (WIP)",
  });
});

router.get("/signup", indexController.signup_get);

router.post("/signup", indexController.signup_post);

router.post("/login", indexController.login_post);

router.get("/user", indexController.user_detail);

router.get("/checkuser/:username", indexController.check_user);

// router.get("/dashboard");

module.exports = router;
