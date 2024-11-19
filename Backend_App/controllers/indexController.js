//TODO: implement passport, jwt, bcrypt signups
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

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

async function signup_get(req, res) {
  res.send("not implemented: signup get");
}

// SIGN UP & create a user
async function signup_post(req, res) {
  const { username, password } = req.body;
  console.log(req.body);

  if (!username || !password) {
    console.log("Error: incomplete credentials");
    return res
      .status(401)
      .send({ message: "Error: missing signup credentials." });
  }

  try {
    result = await prisma.user.create({
      data: {
        username: username,
        password: bcrypt.hashSync(password),
      },
    });
    console.log(result);
  } catch (err) {
    console.log("signup err");
    console.error(err.message);
    return res.status(400).send({ message: "error during signup." });
  }

  res.json({
    message: "Signup POST request completed.",
  });
}

// LOGIN & create jsonwebtoken.
async function login_get(req, res) {
  // getting credentials
  const { username, password } = req.body;
  console.log(req.body);
  if (!username || !password) {
    console.log("error: incomplete request");
    return res.status(400).send({ message: "Error: incomplete request." });
  }
  // Find user
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (!user) {
      console.log("User was not found.");
      return res.status(401).send({ message: "User was not found!" });
    }
    // compare passwords
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      console.log("Incorrect password");
      return res.status(401).send({ message: "Incorrect password!" });
    }

    // --- authorization success: create JWT token ---
    const token = jwt.sign({ user: user }, SECRET_KEY, {
      // token options
      expiresIn: "10000s",
    });
    res.json({
      message: "Login request success.",
      token: token,
    });
  } catch (err) {
    console.log("error during login.");
    return res.status(403).send({ message: "Error during login." });
  }
}
module.exports = {
  signup_get,
  signup_post,
  //
};
