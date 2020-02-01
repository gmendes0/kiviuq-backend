"use strict";

class session {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      username: "required|min:1|max:255",
      email: "required|min:1|max:255|email",
      password: "required|min:6|max:255"
    };
  }
}

module.exports = session;
