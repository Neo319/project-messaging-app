const express = require("express");

const appController = require("../controllers/appController");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("app router (WIP)");
});

// get info for dashboard, links
router.get("/dashboard", appController.dashboard_get);

// get list of users to message/contacts
router.get("/messages", appController.message_get);

router.post("/messages", appController.message_post);

// send a message to a user
// router.post("/messages/:userId")

module.exports = router;
