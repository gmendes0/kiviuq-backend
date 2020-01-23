'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Post = use('App/Models/Post')

/**
 * Resourceful controller for interacting with posts
 */
class PostController {
  /**
   * Show a list of all posts.
   * GET posts
   *
   * @param {object} ctx
   */
  async index () {
    const posts = await Post.query()
      .with('user', (builder) => builder.select(['id', 'username']))
      .fetch()

    return posts
  }

  /**
   * Create/save a new post.
   * POST posts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async store ({ request, auth }) {
    const data = request.only(['description'])
    const user_id = auth.user.id

    const post = await Post.create({...data, user_id})

    return post
  }

  /**
   * Display a single post.
   * GET posts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async show ({ params }) {
    const post = await Post.query()
      .where('id', params.id)
      .with('user', (builder) => builder.select(['id', 'username']))
      .firstOrFail()

    return post
  }

  /**
   * Update post details.
   * PUT or PATCH posts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response, auth }) {
    const data = request.only(['description'])

    const post = await Post.findOrFail(params.id)

    if (post.user_id !== auth.user.id)
      return response.status(401).json({ error: "unauthorized." })

    post.merge({ ...data })

    await post.save()

    return post
  }

  /**
   * Delete a post with id.
   * DELETE posts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response, auth }) {
    const post = await Post.findOrFail(params.id)

    if (post.user_id !== auth.user.id)
      return response.status(401).json({ error: 'unauthorized.' })

    return await post.delete()
  }
}

module.exports = PostController
