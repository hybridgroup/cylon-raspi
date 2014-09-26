/*
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var EventEmitter = require('events').EventEmitter;

var I2C = require('i2c'),
    Cylon = require('cylon');

var I2CDevice = module.exports = function I2CDevice(opts) {
  this.address = opts.address;
  this.hdwInterface = opts["interface"];
  this.i2cWire = new I2C(this.address, {
    device: this.hdwInterface
  });
};

Cylon.Utils.subclass(I2CDevice, EventEmitter);

I2CDevice.prototype.connect = null;

I2CDevice.prototype.disconnect = null;

I2CDevice.prototype.write = function(cmd, buff, callback) {
  this.i2cWire.writeBytes(cmd, buff, callback);
};

I2CDevice.prototype.read = function(cmd, length, callback) {
  this.i2cWire.readBytes(cmd, length, callback);
};

I2CDevice.prototype.writeByte = function(byte, callback) {
  this.i2cWire.writeByte(byte, callback);
};

I2CDevice.prototype.readByte = function(callback) {
  this.i2cWire.readByte(callback);
};
