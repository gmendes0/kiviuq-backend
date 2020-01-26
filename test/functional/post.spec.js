"use strict";

const { test, trait, afterEach, beforeEach } = use("Test/Suite")("Post");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use("App/Models/User");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Post = use("App/Models/Post");

trait("Test/ApiClient");
trait("Auth/Client");

beforeEach(async () => {
  await User.create({
    id: 1,
    username: "mendesg0",
    email: "gmendes230@gmail.com",
    password: "123456"
  });
});

afterEach(async () => {
  await User.query().delete();
  await Post.query().delete();
});

test("it should return all posts.", async ({ client, assert }) => {
  await Post.create({
    description: "First post!",
    user_id: 1
  });

  await Post.create({
    description: "Second post!",
    user_id: 1
  });

  const response = await client.get("/").end();

  response.assertStatus(200);
  assert.isArray(response.body);
  response.assertJSONSubset([
    {
      description: "First post!",
      user_id: 1
    },
    {
      description: "Second post!",
      user_id: 1
    }
  ]);
});

test("it should return only one post when post id given.", async ({
  client,
  assert
}) => {
  const post = await Post.create({
    description: "Second post!",
    user_id: 1
  });

  const response = await client.get(`/posts/${post.id}`).end();

  response.assertStatus(200);
  assert.isNotArray(response.body);
  response.assertJSONSubset({
    description: "Second post!",
    user_id: 1
  });
});

test("it should update an existent post.", async ({ client }) => {
  const post = await Post.create({
    description: "First post!",
    user_id: 1
  });

  const response = await client
    .put(`/posts/${post.id}`)
    .loginVia(await User.query().first())
    .send({
      description: "First post edited!",
      user_id: 1
    })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    description: "First post edited!"
  });
});

test("it should return unauthorized when update an existent post without authenticate.", async ({
  client
}) => {
  await Post.create({
    description: "First post!",
    user_id: 1
  });

  const response = await client
    .put("/posts/1")
    .send({
      description: "First post edited!",
      user_id: 1
    })
    .end();

  response.assertStatus(401);
});

test("it should return not found when trying to update an inexistent post.", async ({
  client
}) => {
  const response = await client
    .put("/posts/-1")
    .loginVia(await User.query().first())
    .send({
      description: "First post edited!",
      user_id: 1
    })
    .end();

  response.assertStatus(404);
});

test("it should delete an existent post.", async ({ client }) => {
  const post = await Post.create({
    description: "First post!",
    user_id: 1
  });

  const response = await client
    .delete(`/posts/${post.id}`)
    .loginVia(await User.query().first())
    .end();

  response.assertStatus(200);
});

test("it should return unauthorized when delete an existent post without authenticate.", async ({
  client
}) => {
  const post = await Post.create({
    description: "First post!",
    user_id: 1
  });

  const response = await client.delete(`/posts/${post.id}`).end();

  response.assertStatus(401);
});

test("it should return not found when trying to delete an inexistent post.", async ({
  client
}) => {
  const response = await client
    .delete("/posts/-1")
    .loginVia(await User.query().first())
    .end();

  response.assertStatus(404);
});
