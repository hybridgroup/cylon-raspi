/*
 * cylon-raspi
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Raspi = require("./raspi");

module.exports = {
  adaptors: ["raspi"],
  dependencies: ["cylon-gpio", "cylon-i2c"],

  adaptor: function(args) {
    return new Raspi(args);
  }
};
