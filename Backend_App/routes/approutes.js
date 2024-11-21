const express = require("express");

const appController = require("../controllers/appController");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("app router (WIP)");
});

router.get("/dashboard", appController.dashboard_get);

module.exports = router;
