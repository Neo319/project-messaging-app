require("dotenv").config;

const indexRouter = require("./routes/index");

const express = require("express");
const port = process.env.PORT || 2000;
//starting app
const app = express();

//parsing json payloads
app.use(express.json());

app.use("/", indexRouter);

app.listen(port, () => {
  console.log("app listening on port: ", port);
});
