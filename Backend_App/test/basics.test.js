const index = require("../routes/index");

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

test("database exists", async (done) => {
  console.log("test user: ", await prisma.user.findFirstOrThrow());
});

// test("index route works", (done) => {
//   request(app).get("/").expect(200, done);
// });

// test("signup_post creates user", (done) => {
//   request(app)
//     .post("/signup")
//     .send({ username: "john", password: "asdf" })
//     .set("Accept", "json")
//     .expect(
//       prisma.user.findFirstOrThrow({
//         where: {
//           username: "john",
//         },
//       })
//     )
//     .end((err, res) => {
//       if (err) return done(err);
//       return done();
//     });
// });
