/*
 * cylon-raspi
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var GPIO, I2C,
    __slice = [].slice;

  require("cylon");

  require("./raspi");

  GPIO = require("cylon-gpio");

  I2C = require("cylon-i2c");

  module.exports = {
    adaptor: function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(Cylon.Adaptors.Raspi, args, function(){});
    },
    driver: function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return GPIO.driver.apply(GPIO, args);
    },
    register: function(robot) {
      Logger.debug("Registering Raspberry Pi adaptor for " + robot.name);
      robot.registerAdaptor('cylon-raspi', 'raspi');
      return GPIO.register(robot);
    }
  };

}).call(this);
