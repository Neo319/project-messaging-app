require("dotenv").config;

const express = require("express");
const port = process.env.PORT || 2000;

//starting app
const app = express();

app.use("/", (req, res) => {
  res.send("Welcome to project Message board (WIP)");
});

app.listen(port, () => {
  console.log("app listening on port: ", port);
});
