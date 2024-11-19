const index = require("../routes/index");

const request = require("supertest");
const express = require("express");
const app = express();

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

// beforeEach(() => {});

app.use(express.urlencoded({ extended: false }));
app.use("/", index);

test("index route works", (done) => {
  request(app).get("/").expect(200, done);
});

test("signup_post creates user", (done) => {
  request(app)
    .post("/signup")
    .send({ username: "john", password: "asdf" })
    .set("Accept", "json")
    .expect(
      prisma.user.findFirstOrThrow({
        where: {
          username: "john",
        },
      })
    )
    .end((err, res) => {
      if (err) return done(err);
      return done();
    });
});
