"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Avatar extends Model {
  user() {
    return this.belongsTo("App/Models/User");
  }
}

module.exports = Avatar;
