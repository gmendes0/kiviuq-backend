"use strict";

const { test, trait, afterEach, beforeEach } = use("Test/Suite")("Post");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use("App/Models/User");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Post = use("App/Models/Post");

trait("Test/ApiClient");

beforeEach(async () => {
  await User.create({
    username: "mendesg0",
    email: "gmendes230@gmail.com",
    password: "123456"
  });
});
