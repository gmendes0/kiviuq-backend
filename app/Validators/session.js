"use strict";

const Antl = use("Antl");

class Session {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      username: "required|min:2|max:255|unique:users,username",
      email: "required|min:1|max:255|email|unique:users,email",
      password: "required|min:6|max:255"
    };
  }

  get messages() {
    return Antl.list("validation");
  }
}

module.exports = Session;
