"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Post extends Model {
  user () {
    return this.belongsTo("App/Models/User");
  }

  comments () {
    return this.hasMany("App/Models/Comments");
  }

  images () {
    return this.hasMany("App/Models/Image");
  }
}

module.exports = Post;
