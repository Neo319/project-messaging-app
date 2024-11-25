const index = require("../routes/index");
const approutes = require("../routes/approutes");

const request = require("supertest");
const express = require("express");
const app = express();
const { execSync } = require("child_process");

//parsing json payloads
app.use(express.json());

//SET UP DB for test environments.
const prisma = (() => {
  const { PrismaClient } = require("@prisma/client");
  const databaseUrl = process.env.TEST_DATABASE_URL;
  return new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });
})();

beforeAll(async () => {
  console.log("Setting up test database...");

  // Reset the database schema
  execSync("npx prisma migrate reset --force --skip-generate", {
    stdio: "inherit",
  });

  // Optionally seed the database with a user table and data
  await prisma.user.create({
    data: {
      username: "test_user",
      password: "securepassword", // Ideally hashed
    },
  });

  console.log("Test database setup complete.");
});

afterAll(async () => {
  // Clean up and disconnect the Prisma Client
  await prisma.$disconnect();
});

app.use(express.urlencoded({ extended: false }));
app.use("/", index);
app.use("/app", approutes);

test("database exists", async () => {
  const user = await prisma.user.findFirstOrThrow();

  expect(user).not.toBeNull();
  //
});

test("signup_post creates user", async () => {
  // Send the POST request
  const response = await request(app)
    .post("/signup")
    .send({ username: "john", password: "asdf" })
    .set("Accept", "application/json");

  // Check the response status
  expect(response.status).toBe(200);

  // Verify the user was created in the database
  const user = await prisma.user.findFirstOrThrow({
    where: {
      username: "john",
    },
  });

  // Assert that the user exists and has the correct data
  expect(user).not.toBeNull();
  expect(user.username).toBe("john");
});

// LOGGING IN TESTS
describe("Login", () => {
  let token; // Variable to store the token

  beforeAll(async () => {
    const response = await request(app)
      .post("/signup")
      .send({ username: "uniqueTest", password: "asdf" });

    //check response status
    expect(response.status).toBe(200);

    const loginResponse = await request(app)
      .post("/login")
      .send({ username: "uniqueTest", password: "asdf" });

    const jsonData = JSON.parse(loginResponse.text);
    // TOKEN FOUND HERE

    token = jsonData.token;
    expect(token).toBeDefined();
  });

  test("sends token on success", async () => {
    expect(token).not.toBeNull();
    expect(token).toBeDefined();
  });
  test("logins fail with incorrect data", async () => {
    const response = await request(app)
      .post("/login")
      .send({ username: "incorrect", password: "incorrect" });
    expect(response.ok).toBeFalsy();
  });
  test("cannot login with incorrect password", async () => {
    const response = await request(app)
      .post("/login")
      .send({ username: "uniqueTest", password: "incorrect" });
    expect(response.ok).toBeFalsy();
  });

  test("app route exists", async () => {
    const response = await request(app).get("/app");
    expect(response.status).toBe(200);
  });

  test("can access protected route only with correct token header", async () => {
    //missing authorization
    const response1 = await request(app).get("/app/dashboard");
    expect(response1.status).toBe(401);

    // incorrect authorization
    const response2 = await request(app)
      .get("/app/dashboard")
      .set("Authorization", `Bearer foobar`);
    expect(response2.status).toBe(401);

    const response3 = await request(app)
      .get("/app/dashboard")
      .set("Authorization", `Bearer ${token}`);
    expect(response3.status).toBe(200);
  });
});

// MESSAGES TESTS
describe("Messages", () => {
  let token; // Variable to store the token
  let token2; // Variable for second user sending messages

  beforeAll(async () => {
    const loginResponse = await request(app)
      .post("/login")
      .send({ username: "uniqueTest", password: "asdf" });

    let jsonData = JSON.parse(loginResponse.text);
    // TOKEN FOUND HERE
    token = jsonData.token;
    expect(token).toBeDefined();

    // user to recieve messages
    const secondUser = await request(app)
      .post("/signup")
      .send({ username: "testSender", password: "fdsa" });

    const secondLoginResponse = await request(app)
      .post("/login")
      .send({ username: "testSender", password: "fdsa" });

    jsonData = JSON.parse(secondLoginResponse.text);
    token2 = jsonData.token;
    expect(token2).toBeDefined();
  });

  test("route exists to view messages", async () => {
    expect(token).toBeDefined();
    const response = await request(app)
      .get("/app/messages")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  test("two users exist", async () => {
    const first = await prisma.user.findUniqueOrThrow({
      where: { username: "john" },
    });
    const second = await prisma.user.findUniqueOrThrow({
      where: { username: "testSender" },
    });
    expect(first).toBeDefined();
    expect(second).toBeDefined();
  });

  test("can access a message from one user to another", async () => {
    // send message from first user to second
    await request(app)
      .post("/app/messages")
      .set("Authorization", `Bearer ${token}`)
      .send({ message: "Test message", reciever: "john" }); // send username of reciever with post request

    //assert this message exists
    const dbMessage = await prisma.message.findFirstOrThrow({
      where: { text: "Test message" },
    });
    expect(dbMessage).not.toBeFalsy;
  });

  test("reciever can see sender in list of contacts", async () => {
    const response = await request(app)
      .get("/app/messages")
      .set("Authorization", `Bearer ${token2}`);

    expect(response.contacts).toBeDefined();
    expect(response.contacts).toBeInstanceOf(Array);
    expect(response.contacts).toContain("john"); // username can be found from this response
  });

  // test("reciever can see message contents in message history")
});
