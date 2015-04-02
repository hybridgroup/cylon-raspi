/*
 * cylon-raspi - I2C stub
 * cylonjs.com
 *
 * Copyright (c) 2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var isTest = process.env.NODE_ENV === "test";

var MockI2C = function MockI2C(address, opts) {
  this.address = address;

  for (var name in opts) {
    this[name] = opts[name];
  }
};

["readByte", "read", "writeByte", "write"].forEach(function(method) {
  MockI2C.prototype[method] = function() {
    throw new Error(
      "MockI2C called (NODE_ENV === 'test'); has no #" + method + "method"
    );
  };
});

module.exports = isTest ? MockI2C : require("i2c");
