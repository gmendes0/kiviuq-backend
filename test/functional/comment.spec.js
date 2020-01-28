"use strict";

const { test, trait, beforeEach, afterEach } = use("Test/Suite")("Comment");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use("App/Models/User");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Post = use("App/Models/Post");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Comment = use("App/Models/Comment");

trait("Test/ApiClient");
trait("Auth/Client");

beforeEach(async () => {
  const user = await User.create({
    id: 1,
    username: "mendesg0",
    email: "gmendes230@gmail.com",
    password: "123456"
  });

  await user.posts().create({
    id: 1,
    description: "First post!"
  });
});

afterEach(async () => {
  await User.query().delete();
  await Post.query().delete();
  await Comment.query().delete();
});

test("it should get all comments", async ({ client, assert }) => {
  const post = await Post.query().first();

  await post.comments().createMany([
    { content: "Amazing!", user_id: 1 },
    { content: "Wow!", user_id: 1 }
  ]);

  const resposne = await client.get("/posts/1/comments").end();

  resposne.assertStatus(200);
  assert.isArray(resposne.body);
  resposne.assertJSONSubset([{ content: "Amazing!" }, { content: "Wow!" }]);
});

test("it should create a comment", async ({ client, assert }) => {
  const post = await Post.query().first();

  const resposne = await client
    .post(`/posts/${post.id}/comments`)
    .send({ content: "Amazing!" })
    .loginVia(await User.query().first())
    .end();

  resposne.assertStatus(200);
  assert.isNotArray(resposne.body);
  resposne.assertJSONSubset({ content: "Amazing!" });
});

test("it should get only one comment when comment id given", async ({
  client,
  assert
}) => {
  const post = await Post.query().first();

  const comment = await post
    .comments()
    .create({ content: "Amazing!", user_id: 1 });

  const resposne = await client.get(`/comments/${comment.id}`).end();

  resposne.assertStatus(200);
  assert.isNotArray(resposne.body);
  resposne.assertJSONSubset({ content: "Amazing!" });
});
