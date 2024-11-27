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
    jwt.verify(req.token, SECRET_KEY, async (err, authData) => {
      if (err) {
        return res.status(401).send({ message: "error during authorization." });
      } else {
        console.log("successful message authentication");
        try {
          // Find all users needed
          const authUser = await prisma.user.findUnique({
            where: { id: authData.user.id },
          });
          console.log(authUser);

          // collect all users where message history exists...
          async function getUsersWithMessageHistory(userId) {
            const users = await prisma.user.findMany({
              where: {
                OR: [
                  {
                    sentMessages: {
                      some: {
                        recieverId: userId,
                      },
                    },
                  },
                  {
                    recievedMessages: {
                      some: {
                        senderId: userId,
                      },
                    },
                  },
                ],
              },
              select: {
                id: true,
                username: true,
              },
            });

            return users;
          }
          const users = await getUsersWithMessageHistory(authUser.id);

          // return array in res
          return res.send({ contacts: users });
        } catch (err) {
          console.error("error fetching messages", err.message);
          res.send(err.message);
          res.status(400).end();
        }
      }
      console.error("message_get route should not end here");
      res.end("route ended...");
    });
  },
];

// --- GET ALL MESSAGES WITH ONE USER ---
const conversation_get = [
  verify,
  function (req, res) {
    jwt.verify(req.token, SECRET_KEY, async (err, authData) => {
      try {
        console.log("here!");
        const clientUser = authData.user;
        const user2 = await prisma.user.findFirstOrThrow({
          where: {
            username: req.params.user,
          },
        });

        console.log("debug: user2 = ", user2);
        console.log(req.params);

        // handle errors
        if (!clientUser || !user2 || !req.params.user) {
          console.error(
            "error getting conversation -- missing data: ",
            clientUser,
            user2
          );
          return res.send(400);
        }

        //return all message data between users
        async function getAllMessages(user) {
          const messages = await prisma.message.findMany({
            where: {
              OR: [
                { senderId: clientUser.id, recieverId: user2.id },
                { senderId: user2.id, recieverId: clientUser.id },
              ],
            },
          });
          return messages;
        }

        const messages = await getAllMessages(clientUser);
        console.log("debug-- messages : ", messages);
        return res.send({ messages });
      } catch (err) {
        console.error("error getting conversation.", err.message);
        res.send(err.message);
        res.status(400).end();
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

  conversation_get,
  //
};

// TODO: implement db queries in these routes

//TODO: routes -
//  - message_post(user in body) ;
//  - message_get/:user (display message history w/ user) ;
//  - add user as a friend/contact?
//  - later: customize own profile

//  (message updates and deletes later)
