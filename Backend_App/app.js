require("dotenv").config;

const indexRouter = require("./routes/index");

const express = require("express");
const port = process.env.PORT || 2000;
//starting app
const app = express();

app.use("/", indexRouter);

app.listen(port, () => {
  console.log("app listening on port: ", port);
});
