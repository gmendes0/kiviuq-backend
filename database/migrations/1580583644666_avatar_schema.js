"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AvatarSchema extends Schema {
  up() {
    this.create("avatars", table => {
      table.increments();
      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.string("filename");
      table.string("originalname");
      table.integer("size");
      table.string("url");
      table.timestamps();
    });
  }

  down() {
    this.drop("avatars");
  }
}

module.exports = AvatarSchema;
