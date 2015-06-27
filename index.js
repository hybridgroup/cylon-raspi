"use strict";

var Raspi = require("./lib/raspi");

module.exports = {
  adaptors: ["raspi"],
  dependencies: ["cylon-gpio", "cylon-i2c"],

  adaptor: function(args) {
    return new Raspi(args);
  }
};
