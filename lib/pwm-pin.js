/*
 * Raspi PWM lPin
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var FS = require("fs"),
    EventEmitter = require("events").EventEmitter;

var Cylon = require("cylon");

var BLASTER_PATH = "/dev/pi-blaster";

var PwmPin = module.exports = function PwmPin(opts) {
  this.pinNum = opts.pin;
  this.ready = false;
};

Cylon.Utils.subclass(PwmPin, EventEmitter);

PwmPin.prototype.connect = function() {
  FS.appendFile(BLASTER_PATH, "" + this.pinNum + "=0" + "\n", function(err) {
    if (err) {
      this.emit("error", "Error while writing to PI-Blaster file");
    } else {
      this.emit("connect");
    }
  }.bind(this));
};

PwmPin.prototype.close = function() {
  FS.appendFile(BLASTER_PATH, "release " + this.pinNum + "\n", function(err) {
    this._releaseCallback(err);
  }.bind(this));
};

PwmPin.prototype.closeSync = function() {
  FS.appendFileSync(BLASTER_PATH, "release " + this.pinNum + "\n");
  this._releaseCallback(false);
};

PwmPin.prototype.pwmWrite = function(duty, servo) {
  if (servo == null) {
    servo = false;
  }

  this.pbVal = (servo) ? this._servoVal(duty) : duty;

  var val = "" + this.pinNum + "=" + this.pbVal + "\n";

  FS.appendFile(BLASTER_PATH, val, function(err) {
    if (err) {
      var value = this.pbVal,
          pin = this.pinNum;

      this.emit("error",
        "Error occurred while writing value " + value + " to pin " + pin
      );
    } else {
      this.emit("pwmWrite", duty);
    }
  }.bind(this));
};

PwmPin.prototype.servoWrite = function(duty) {
  this.pwmWrite(duty, true);
};

PwmPin.prototype._releaseCallback = function(err) {
  if (err) {
    this.emit("error", "Error while releasing pwm pin");
  } else {
    this.emit("release", this.pinNum);
  }
};

PwmPin.prototype._servoVal = function(duty) {
  var calc;
  calc = ((duty).toScale(0, 200) / 1000) + 0.05;
  calc = calc > 0.25 ? 0.25 : calc;
  calc = calc < 0.05 ? 0.05 : calc;
  return calc;
};
