"use strict";

const { test, trait, beforeEach, afterEach } = use("Test/Suite")("Avatar");

const Helpers = use("Helpers");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use("App/Models/User");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Avatar = use("App/Models/Avatar");

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
  await Avatar.query().delete();
});

test("it should store the user avatar", async ({ client }) => {
  const response = await client
    .post("/users/avatars")
    .loginVia(await User.query().first())
    .attach(
      "avatar",
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

test("it should delete the user avatar", async ({ client }) => {
  const user = await User.query().first();

  await user.avatar().create({
    user_id: user.id,
    filename:
      "1580254850719-Gray_anime_face_hair_mask_hd-wallpaper-82164 (1).jpg",
    originalname: "Gray_anime_face_hair_mask_hd-wallpaper-82164 (1).jpg",
    size: 124314,
    url: ""
  });

  const response = await client
    .delete(`/users/avatars`)
    .loginVia(await User.query().first())
    .end();

  response.assertStatus(200);
});
