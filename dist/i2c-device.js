/*
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var EventEmitter, I2C, namespace,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  I2C = require('i2c');

  EventEmitter = require('events').EventEmitter;

  namespace = require('node-namespace');

  namespace('Cylon.I2C', function() {
    return this.I2CDevice = (function(_super) {
      __extends(I2CDevice, _super);

      function I2CDevice(opts) {
        this.address = opts.address;
        this.hdwInterface = opts["interface"];
        this.i2cWire = new I2C(this.address, {
          device: this.hdwInterface
        });
      }

      I2CDevice.prototype.connect = null;

      I2CDevice.prototype.disconnect = null;

      I2CDevice.prototype.write = function(cmd, buff, callback) {
        return this.i2cWire.writeBytes(cmd, buff, callback);
      };

      I2CDevice.prototype.read = function(cmd, length, callback) {
        return this.i2cWire.readBytes(cmd, length, callback);
      };

      I2CDevice.prototype.writeByte = function(byte, callback) {
        return this.i2cWire.writeByte(byte, callback);
      };

      I2CDevice.prototype.readByte = function(callback) {
        return this.i2cWire.readByte(callback);
      };

      return I2CDevice;

    })(EventEmitter);
  });

}).call(this);
