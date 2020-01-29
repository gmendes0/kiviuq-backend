"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.post("/register", "AuthController.register");
Route.post("/authenticate", "AuthController.authenticate");

/**
 * Post routes
 */
Route.get("/", "PostController.index");
Route.get("/posts/:id", "PostController.show");

/**
 * Comment routes
 */
Route.get("/posts/:post_id/comments/", "CommentController.index");
Route.get("/comments/:comment_id", "CommentController.show");

Route.group(() => {
  /**
   * Post routes
   */
  Route.post("/posts", "PostController.store");
  Route.put("/posts/:id", "PostController.update");
  Route.delete("/posts/:id", "PostController.destroy");

  /**
   * Comment routes
   */
  Route.post("posts/:post_id/comments", "CommentController.store");
  Route.put("/comments/:comment_id", "CommentController.update");
  Route.delete("/comments/:comment_id", "CommentController.destroy");

  /**
   * Image routes
   */
  Route.post("posts/:post_id/images", "ImageController.store");
  Route.delete("/images/:id", "ImageController.destroy");
}).middleware("auth");
