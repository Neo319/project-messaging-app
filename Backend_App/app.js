require("dotenv").config;

const indexRouter = require("./routes/index");
const appRouter = require("./routes/approutes");
const cors = require("cors");

const express = require("express");
const port = process.env.PORT || 2000;
//starting app
const app = express();

//parsing json payloads
app.use(express.json());

// allowing requests from appropriate origins
const allowedOrigins =
  process.env.NODE_ENV === "dev"
    ? "*" // development env
    : ["https://neo319.github.io"]; // production env

app.use(
  cors({
    origin: allowedOrigins,
    methods: "POST, GET, PUT, DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/", indexRouter);
app.use("/app", appRouter);

app.listen(port, () => {
  console.log("app listening on port: ", port);
});
