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
  console.log("using db url: ", databaseUrl);
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

    // TOKEN FOUND HERE
    console.log("debug: token = ", loginResponse.text);

    token = loginResponse.token;
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

  test("can access protected route only with token header", async () => {
    const response1 = await request(app).get("/app/dashboard");
    //missing authorization
    console.log("missing auth req status", response1.status);
    expect(response1.status).toBe(401);

    const response2 = await request(app)
      .get("/app/dashboard")
      .set("Authorization", `Bearer ${token}`);

    console.log("authorized request status:", response2.status);
    expect(response2.status).toBe(200);
  });
});
