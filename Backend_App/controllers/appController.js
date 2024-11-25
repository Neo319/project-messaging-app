require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken");
const verify = require("../config/jwt");

//SET UP DB for either test or dev environments.
const prisma = (() => {
  const { PrismaClient } = require("@prisma/client");

  const databaseUrl =
    process.env.NODE_ENV === "test"
      ? process.env.TEST_DATABASE_URL
      : process.env.DATABASE_URL;
  return new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });
})();

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
          .send({ message: "successfully renders dashboard" }); // TODO: should send array of users that have any message history
      }
    });
  },
];

//MESSAGES FUNCTIONALITY
const message_get = [
  verify,
  function (req, res) {
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

const message_post = [
  verify,
  function (req, res) {
    jwt.verify(req.token, SECRET_KEY, async (err, authData) => {
      try {
        if (err) return console.error("error in validation", err.message);

        console.log("here!");
        // validate and trim message contents
        const messageText = req.body.message.trim();
        const recieverName = req.body.reciever;

        const reciever = await prisma.user.findUniqueOrThrow({
          where: {
            username: recieverName,
          },
        });
        // error handling
        if (typeof messageText !== "string" || messageText === "" || !reciever)
          return false;

        await prisma.message.create({
          data: {
            text: messageText,
            senderId: authData.user.id,
            recieverId: reciever.id,
          },
        });
        console.log("message send success.");
        return res.send("message send success");
      } catch (err) {
        console.error("error posting message", err.message);
        res.error(err.message);
      }
      console.error("message post request ended...");
      return res.send("should not be here");
    });
  },
];

module.exports = {
  dashboard_get,
  message_get,
  message_post,
  //
};

// TODO: implement db queries in these routes

//TODO: routes -
//  - message_post(user in body) ;
//  - message_get/:user (display message history w/ user) ;
//  - add user as a friend/contact?
//  - later: customize own profile

//  (message updates and deletes later)
