require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken");
const verify = require("../config/jwt");

//PROTECTED ROUTE
const dashboard_get = [
  verify,
  async function (req, res) {
    jwt.verify(req.token, SECRET_KEY, (err, authData) => {
      if (err) {
        return res.status(401).send({ message: "error during authorization." });
      } else {
        console.log("successful -- ", authData);
        return res
          .status(200)
          .send({ message: "successfully renders dashboard" });
      }
    });
  },
];

//MESSAGES FUNCTIONALITY
const message_get = [
  verify,
  async function (req, res) {
    jwt.verify(req.token, SECRET_KEY, (err, authData) => {
      if (err) {
        return res.status(401).send({ message: "error during authorization." });
      } else {
        console.log("successful message authentication");
        return res.send({ message: "render list of users to message..." });
      }
    });
  },
];

module.exports = {
  dashboard_get,
  message_get,
  //
};

// TODO: implement db queries in these routes
