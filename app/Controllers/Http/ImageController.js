"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Helpers = use("Helpers");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Post = use("App/Models/Post");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Image = use("App/Models/Image");

/**
 * Resourceful controller for interacting with images
 */
class ImageController {
  /**
   * Create/save a new image.
   * POST images
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, params, auth }) {
    const post = await Post.findOrFail(params.post_id);

    const postImage = request.file("image", {
      types: ["image"],
      size: "2mb"
    });

    await postImage.move(Helpers.tmpPath("uploads"), {
      name: `${Date.now()}-${postImage.clientName}`
    });

    if (!postImage.moved()) return postImage.error();

    const image = await post.images().create({
      user_id: auth.user.id,
      filename: postImage.fileName,
      originalname: postImage.clientName,
      size: postImage.size,
      url: ""
    });

    return image;
  }

  /**
   * Delete a image with id.
   * DELETE images/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response, auth }) {
    const image = await Image.findOrFail(params.id);

    if (image.user_id !== auth.user.id)
      return response.status(401).json({ error: "unauthorized." });

    return await image.delete();
  }
}

module.exports = ImageController;
