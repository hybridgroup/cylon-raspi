/*
 * Cylonjs Raspi adaptor
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Cylon = require('cylon');

var PwmPin = require("./pwm-pin"),
    I2CDevice = require('./i2c-device');

var PINS = {
  3: {
    rev1: 0,
    rev2: 2
  },
  5: {
    rev1: 1,
    rev2: 3
  },
  7: 4,
  8: 14,
  10: 15,
  11: 17,
  12: 18,
  13: {
    rev1: 21,
    rev2: 27
  },
  15: 22,
  16: 23,
  18: 24,
  19: 10,
  21: 9,
  22: 25,
  23: 11,
  24: 8,
  26: 7
};

var I2C_INTERFACE = '/dev/i2c-1';

var Raspi = module.exports = function Raspi() {
  Raspi.__super__.constructor.apply(this, arguments);
  this.board = "";
  this.pins = {};
  this.pwmPins = {};
  this.i2cDevices = {};
  this.myself = this;
};

Cylon.Utils.subclass(Raspi, Cylon.Adaptor);

Raspi.prototype.commands = [
  'pins', 'pinMode', 'digitalRead', 'digitalWrite',
  'pwmWrite', 'servoWrite',
  'firmwareName',
  'i2cWrite', 'i2cRead'
];

Raspi.prototype.connect = function(callback) {
  this.proxyMethods(this.commands, this.board, this.myself);
  callback();
};

Raspi.prototype.disconnect = function(callback) {
  Cylon.Logger.debug("Disconnecting all pins...");
  this._disconnectPins();
  Cylon.Logger.debug("Disconnecting from board '" + this.name + "'...");
  this.connection.emit('disconnect');
  callback();
};

Raspi.prototype.firmwareName = function() {
  return 'Raspberry Pi';
};

Raspi.prototype.digitalRead = function(pinNum, drCallback) {
  var pin = this.pins[this._translatePin(pinNum)];

  if (pin == null) {
    pin = this._digitalPin(pinNum, 'r');
    pin.on('digitalRead', function(val) {
      this.connection.emit('digitalRead', val);
      drCallback(null, val);
    }.bind(this));
    pin.on('connect', function() {
      pin.digitalRead(20);
    });
    pin.connect();
  }

  return true;
};

Raspi.prototype.digitalWrite = function(pinNum, value) {
  var pin = this.pins[this._translatePin(pinNum)];

  if ((pin != null)) {
    pin.digitalWrite(value);
  } else {
    pin = this._digitalPin(pinNum, 'w');
    pin.on('digitalWrite', function(val) {
      this.connection.emit('digitalWrite', val);
    }.bind(this));
    pin.on('connect', function() {
      pin.digitalWrite(value);
    });
    pin.connect();
  }

  return value;
};

Raspi.prototype.i2cWrite = function(address, cmd, buff, callback) {
  if (callback == null) {
    callback = null;
  }

  buff = buff != null ? buff : [];

  this._i2cDevice(address).write(cmd, buff, callback);
};

Raspi.prototype.i2cRead = function(address, cmd, length, callback) {
  if (callback == null) {
    callback = null;
  }
  this._i2cDevice(address).read(cmd, length, callback);
};

Raspi.prototype._i2cDevice = function(address) {
  if (this.i2cDevices[address] == null) {
    this.i2cDevices[address] = new I2CDevice({
      address: address,
      "interface": I2C_INTERFACE
    });
  }
  return this.i2cDevices[address];
};

Raspi.prototype.pwmWrite = function(pinNum, value) {
  var pin;
  pin = this._pwmPin(pinNum);
  pin.pwmWrite(value);
  return value;
};

Raspi.prototype.servoWrite = function(pinNum, angle) {
  var pin;
  pin = this._pwmPin(pinNum);
  pin.servoWrite(angle);
  return angle;
};

Raspi.prototype._pwmPin = function(pinNum) {
  var gpioPinNum;
  gpioPinNum = this._translatePin(pinNum);

  if (this.pwmPins[gpioPinNum] == null) {
    this.pwmPins[gpioPinNum] = new PwmPin({
      pin: gpioPinNum
    });
  }

  return this.pwmPins[gpioPinNum];
};

Raspi.prototype._digitalPin = function(pinNum, mode) {
  var gpioPinNum;
  gpioPinNum = this._translatePin(pinNum);

  if (this.pins[gpioPinNum] == null) {
    this.pins[gpioPinNum] = new Cylon.IO.DigitalPin({
      pin: gpioPinNum,
      mode: mode
    });
  }

  return this.pins[gpioPinNum];
};

Raspi.prototype._translatePin = function(pinNum) {
  return PINS[pinNum];
};

Raspi.prototype._disconnectPins = function() {
  var key, pin, _ref, _ref1, _results;
  _ref = this.pins;

  for (key in _ref) {
    pin = _ref[key];
    pin.closeSync();
  }

  _ref1 = this.pwmPins;
  _results = [];

  for (key in _ref1) {
    pin = _ref1[key];
    _results.push(pin.closeSync());
  }

  return _results;
};
