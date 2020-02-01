"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Helpers = use("Helpers");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use("App/Models/User");

/**
 * Resourceful controller for interacting with avatars
 */
class AvatarController {
  /**
   * Create/save a new avatar.
   * POST avatars
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, auth }) {
    const user = await User.findOrFail(auth.user.id);

    const avatarImage = request.file("avatar", {
      types: ["image"],
      size: "2mb"
    });

    await avatarImage.move(Helpers.tmpPath(`uploads/avatars/${user.id}`), {
      name: `${Date.now()}.${avatarImage.subtype}`,
      overwrite: true
    });

    if (!avatarImage.moved()) return avatarImage.error();

    const imageData = {
      filename: avatarImage.fileName,
      originalname: avatarImage.clientName,
      size: avatarImage.size,
      url: ""
    };

    const avatar = await user.avatar().fetch();

    if (avatar) {
      avatar.merge(imageData);

      await avatar.save();

      return await user.avatar().fetch();
    }

    await user.avatar().create(imageData);

    return await user.avatar().fetch();
  }

  /**
   * Delete a avatar with id.
   * DELETE avatars/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ auth }) {
    const user = await User.findOrFail(auth.user.id);

    return await user.avatar().delete();
  }
}

module.exports = AvatarController;
