"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Comment = use("App/Models/Comment");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Post = use("App/Models/Post");

/**
 * Resourceful controller for interacting with comments
 */
class CommentController {
  /**
   * Show a list of all comments.
   * GET comments
   *
   * @param {object} ctx
   */
  async index({ params }) {
    const post = await Post.query()
      .where("id", params.post_id)
      .with("comments", builder => {
        builder.with("user", builder => {
          builder.select(["id", "username"]);
        });
      })
      .firstOrFail();

    return post.comments;
  }

  /**
   * Create/save a new comment.
   * POST comments
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async store({ request, params, auth }) {
    const data = request.only(["content"]);
    const post_id = params.post_id;
    const user_id = auth.user.id;

    const comment = await Comment.create({ ...data, post_id, user_id });

    return comment;
  }

  /**
   * Display a single comment.
   * GET comments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async show({ params }) {
    const comment = await Comment.query()
      .where("id", params.comment_id)
      .with("user", builder => {
        builder.select(["id", "username"]);
      })
      .firstOrFail();

    return comment;
  }

  /**
   * Update comment details.
   * PUT or PATCH comments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, auth, response }) {
    const data = request.only(["content"]);
    const user_id = auth.user.id;

    if (comment.user_id !== auth.user.id)
      return response.status(401).json({ error: "unauthorized." });

    const comment = await Comment.findOrFail(params.comment_id);

    comment.merge({ ...data });

    await comment.save();

    return comment;
  }

  /**
   * Delete a comment with id.
   * DELETE comments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response, auth }) {
    const comment = await Comment.findOrFail(params.comment_id);

    if (auth.user.id !== comment.user_id)
      return response.status(401).json({ error: "unauthorized." });

    return await comment.delete();
  }
}

module.exports = CommentController;
