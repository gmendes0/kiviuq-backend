"use strict";

const { test, trait, beforeEach, afterEach } = use("Test/Suite")("Image");

const Helpers = use("Helpers");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use("App/Models/User");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Post = use("App/Models/Post");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Image = use("App/Models/Image");

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
  await Image.query().delete();
});

test("it should store the image", async ({ client }) => {
  const response = await client
    .post("/posts/1/images")
    .loginVia(await User.query().first())
    .attach(
      "image",
      Helpers.tmpPath(
        "/uploads/1580254802566-Gray_anime_face_hair_mask_hd-wallpaper-82164 (1).jpg"
      )
    )
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    originalname:
      "1580254802566-Gray_anime_face_hair_mask_hd-wallpaper-82164 (1).jpg"
  });
});

test("it should delete the image", async ({ client }) => {
  const post = await Post.query().first();
  const user = await User.query().first();

  const image = await post.images().create({
    user_id: user.id,
    filename:
      "1580254850719-Gray_anime_face_hair_mask_hd-wallpaper-82164 (1).jpg",
    originalname: "Gray_anime_face_hair_mask_hd-wallpaper-82164 (1).jpg",
    size: 124314,
    url: ""
  });

  const response = await client
    .delete(`/images/${image.id}`)
    .loginVia(await User.query().first())
    .end();

  response.assertStatus(200);
});
