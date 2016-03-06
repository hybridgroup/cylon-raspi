/*
 * cylon-raspi - I2C stub
 * cylonjs.com
 *
 * Copyright (c) 2013-2016 The Hybrid Group
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

["sendByte", "i2cRead", "receiveByte", "i2cWrite"].forEach(function(method) {
  MockI2C.prototype[method] = function() {
    throw new Error(
      "MockI2C called (NODE_ENV === 'test'); has no #" + method + "method"
    );
  };
});

MockI2C.openSync = function() {
  throw new Error(
    "MockI2C called (NODE_ENV === 'test'); has no openSync method"
  );
};


module.exports = isTest ? MockI2C : require("i2c-bus");
