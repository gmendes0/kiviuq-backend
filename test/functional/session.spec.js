"use strict";

const { test, trait } = use("Test/Suite")("Session authentication tests");

trait("Test/ApiClient");

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

test("it should return status 401 unauthorized if the email or password are incorrect.", async ({
  client
}) => {
  const response = await client
    .post("/authenticate")
    .send({
      email: "gmendes230@gmail.com",
      password: "12345adsfdfadsadfs"
    })
    .end();

  response.assertStatus(401);
});
