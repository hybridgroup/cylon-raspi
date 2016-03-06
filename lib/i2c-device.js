/*
 * cylon-raspi - I2C Device
 * cylonjs.com
 *
 * Copyright (c) 2013-2016 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

var EventEmitter = require("events").EventEmitter,
    I2C = require("./i2c");

var I2CDevice = module.exports = function I2CDevice(opts) {
  this.address = opts.address;
  this.bus = opts.bus;
};

Cylon.Utils.subclass(I2CDevice, EventEmitter);

I2CDevice.prototype.connect = function() {
  this.i2cWire = I2C.openSync(this.bus);
};

I2CDevice.prototype.disconnect = function() {};

I2CDevice.prototype.write = function(cmd, buff, callback) {
  var b = new Buffer([cmd].concat(buff));
  this.i2cWire.i2cWrite(this.address, b.length, b, callback);
};

I2CDevice.prototype.read = function(cmd, length, callback) {
  var that = this;
  var b = new Buffer([cmd]);
  this.i2cWire.i2cWrite(this.address, b.length, b, function(err) {
    if (err) {
      callback(err, null);
    } else {
      that.i2cWire.i2cRead(that.address, length, callback);
    }
  });
};

I2CDevice.prototype.writeByte = function(byte, callback) {
  this.i2cWire.sendByte(this.address, byte, callback);
};

I2CDevice.prototype.readByte = function(callback) {
  return this.i2cWire.receiveByte(this.address, callback);
};
