/*
 * Cylonjs Raspi adaptor
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

var PwmPin = require("./pwm-pin"),
    I2CDevice = require("./i2c-device"),
    fs = require("fs");

var PINS = {
  3: {
    rev1: 0,
    rev2: 2,
    rev3: 2
  },
  5: {
    rev1: 1,
    rev2: 3,
    rev3: 3
  },
  7: 4,
  8: 14,
  10: 15,
  11: 17,
  12: 18,
  13: {
    rev1: 21,
    rev2: 27,
    rev3: 27
  },
  15: 22,
  16: 23,
  18: 24,
  19: 10,
  21: 9,
  22: 25,
  23: 11,
  24: 8,
  26: 7,
  29: { rev3: 5 },
  31: { rev3: 6 },
  32: { rev3: 12 },
  33: { rev3: 13 },
  35: { rev3: 19 },
  36: { rev3: 16 },
  37: { rev3: 26 },
  38: { rev3: 20 },
  40: { rev3: 21 }
};

var Raspi = module.exports = function Raspi() {
  Raspi.__super__.constructor.apply(this, arguments);

  this.board = "";
  this.pins = {};
  this.pwmPins = {};
  this.i2cDevices = {};
};

Cylon.Utils.subclass(Raspi, Cylon.Adaptor);

Raspi.prototype.commands = [
  "pins",
  "pinMode",

  "firmwareName",

  "digitalRead",
  "digitalWrite",

  "pwmWrite",
  "servoWrite",

  "i2cWrite",
  "i2cRead"
];

/**
 * Connects to the Raspberry Pi
 *
 * @param {Function} callback to be triggered when connected
 * @return {void}
 */
Raspi.prototype.connect = function(callback) {
  this.proxyMethods(this.commands, this.board, this);

  var cpuinfo = this._cpuinfo();
  var revisionCode = cpuinfo.match(/Revision\s*:\s*([\da-fA-F]+)/)[1];
  var revision = parseInt(revisionCode, 16);

  this.i2cInterface = "/dev/i2c-1";

  if (revision <= 3) {
    this.revision = "rev1";
    this.i2cInterface = "/dev/i2c-0";
  } else if (revision <= 15) {
    this.revision = "rev2";
  } else {
    this.revision = "rev3";
  }

  Cylon.Logger.debug("Raspberry Pi ", this.revision, " detected.");
  callback();
};

/**
 * Disconnects from the Raspberry Pi
 *
 * @param {Function} callback to be triggered when disconnected
 * @return {void}
 */
Raspi.prototype.disconnect = function(callback) {
  Cylon.Logger.debug("Disconnecting all pins...");
  this._disconnectPins();
  Cylon.Logger.debug("Disconnecting from board '" + this.name + "'...");
  this.emit("disconnect");
  callback();
};

Raspi.prototype.firmwareName = function() {
  return "Raspberry Pi";
};

/**
 * Reads a value from a digital pin
 *
 * @param {Number} pinNum pin to read from
 * @param {Function} callback triggered when the value has been read from the
 * pin
 * @return {void}
 * @publish
 */
Raspi.prototype.digitalRead = function(pinNum, callback) {
  var pin = this.pins[this._translatePin(pinNum)];

  if (pin == null) {
    pin = this._digitalPin(pinNum, "r");

    pin.on("digitalRead", function(val) {
      this.respond("digitalRead", callback, null, val, pinNum);
    }.bind(this));

    // We listen for the connect event to make sure the pin
    // has been setup in Linux IO first. Once connected we
    // trigger the digitalRead, this happens only once.
    pin.on("connect", function() {
      pin.digitalRead(20);
    });

    pin.connect();
  }

  return true;
};

/**
 * Writes a value to a digital pin
 *
 * @param {Number} pinNum pin to write to
 * @param {Number} value value to write to the pin
 * @param {Function} callback function to invoke when done
 * @return {void}
 * @publish
 */
Raspi.prototype.digitalWrite = function(pinNum, value, callback) {
  var pin = this.pins[this._translatePin(pinNum)];

  if (pin != null) {
    pin.digitalWrite(value);
  } else {
    pin = this._digitalPin(pinNum, "w");

    pin.on("digitalWrite", function(val) {
      this.respond("digitalWrite", callback, null, val, pinNum);
    }.bind(this));

    // We listen for the connect event to make sure the pin
    // has been setup in Linux IO first. Once connected we
    // trigger the digitalWrite, this happens only once.
    pin.on("connect", function() {
      pin.digitalWrite(value);
    });

    pin.connect();
  }

  return value;
};

/**
 * Writes an I2C value to the board.
 *
 * @param {Number} address I2C address to write to
 * @param {Number} cmd I2C command to write
 * @param {Array} buff buffered data to write
 * @param {Function} callback function to call when done
 * @return {void}
 * @publish
 */
Raspi.prototype.i2cWrite = function(address, cmd, buff, callback) {
  buff = buff || [];

  this._i2cDevice(address).write(cmd, buff, function() {
    this.respond("i2cWrite", callback, null, address, cmd, buff);
  }.bind(this));
};

/**
 * Reads an I2C value from the board.
 *
 * @param {Number} address I2C address to write to
 * @param {Number} cmd I2C command to write
 * @param {Number} length amount of data to read
 * @param {Function} callback function to call with data
 * @return {void}
 * @publish
 */
Raspi.prototype.i2cRead = function(address, cmd, length, callback) {
  this._i2cDevice(address).read(cmd, length, function(err, data) {
    this.respond("i2cRead", callback, err, data);
  }.bind(this));
};

Raspi.prototype._i2cDevice = function(address) {
  if (this.i2cDevices[address] == null) {
    this.i2cDevices[address] = new I2CDevice({
      address: address,
      "interface": this.i2cInterface
    });
  }
  return this.i2cDevices[address];
};

/**
 * Writes a PWM value to a pin
 *
 * @param {Number} pinNum pin to write to
 * @param {Number} value value to write to the pin
 * @param {Number} callback function to call when done
 * @param {Number} type write type
 * @return {void}
 * @private
 */
Raspi.prototype._pwmWrite = function(pinNum, value, callback, type) {
  var pin;
  pin = this._pwmPin(pinNum);

  type = type || "pwm";

  pin.on("pwmWrite", function() {
    this.respond(type + "Write", callback, null, value, pinNum);
  }.bind(this));

  if (type === "servo") {
    pin.servoWrite(value);
  } else {
    pin.pwmWrite(value);
  }
};

/**
 * Writes a pwm value to a pin
 *
 * @param {Number} pinNum pin to write to
 * @param {Number} angle angle to write to the pin
 * @param {Number} callback function to call when done
 * @return {void}
 * @publish
 */
Raspi.prototype.pwmWrite = function(pinNum, angle, callback) {
  this._pwmWrite(pinNum, angle, callback, "pwm");
};

/**
 * Writes a servo value to a pin
 *
 * @param {Number} pinNum pin to write to
 * @param {Number} angle angle to write to the pin
 * @param {Number} callback function to call when done
 * @return {void}
 * @publish
 */
Raspi.prototype.servoWrite = function(pinNum, angle, callback) {
  this._pwmWrite(pinNum, angle, callback, "servo");
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
  var pin = PINS[pinNum];

  if (typeof pin === "object") {
    return pin[this.revision];
  }

  return pin;
};

Raspi.prototype._disconnectPins = function() {
  var pin;

  for (pin in this.pins) {
    this.pins[pin].closeSync();
  }

  for (pin in this.pwmPins) {
    this.pwmPins[pin].closeSync();
  }
};

Raspi.prototype._cpuinfo = function() {
  return fs.readFileSync("/proc/cpuinfo", { encoding: "utf-8" });
};
