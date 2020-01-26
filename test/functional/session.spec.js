"use strict";

const { test, trait, afterEach } = use("Test/Suite")(
  "Session authentication tests"
);

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use("App/Models/User");

trait("Test/ApiClient");

afterEach(async () => {
  await User.query().delete();
});

test("create a user.", async ({ client }) => {
  const response = await client
    .post("/register")
    .send({
      username: "mendesg0",
      email: "gmendes230@gmail.com",
      password: "123456"
    })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    username: "mendesg0",
    email: "gmendes230@gmail.com"
  });
});

test("it should return the jwt when user authenticate.", async ({ client }) => {
  await User.create({
    username: "mendesg0",
    email: "gmendes230@gmail.com",
    password: "123456"
  });

  const response = await client
    .post("/authenticate")
    .send({
      email: "gmendes230@gmail.com",
      password: "123456"
    })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    type: "bearer"
  });
});

test("it should return status 500 if no data given to register", async ({
  client
}) => {
  const response = await client.post("/register").end();

  response.assertStatus(500);
});

test("it should return status 401 unauthorized if the email or password are incorrect.", async ({
  client
}) => {
  await User.create({
    username: "mendesg0",
    email: "gmendes230@gmail.com",
    password: "123456"
  });

  const response = await client
    .post("/authenticate")
    .send({
      email: "gmendes230@gmail.com",
      password: "12345adsfdfadsadfs"
    })
    .end();

  response.assertStatus(401);
});

test("it should return status 401 if no data given to authenticate.", async ({
  client
}) => {
  const response = await client.post("/authenticate").end();

  response.assertStatus(401);
});
