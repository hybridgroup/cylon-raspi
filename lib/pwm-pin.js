/*
 * Raspi PWM lPin
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var FS = require('fs'),
    EventEmitter = require('events').EventEmitter;

var Cylon = require('cylon');

var BLASTER_PATH = "/dev/pi-blaster";

var PwmPin = module.exports = function PwmPin(opts) {
  this.pinNum = opts.pin;
  this.ready = false;
};

Cylon.Utils.subclass(PwmPin, EventEmitter);

PwmPin.prototype.connect = function() {
  var _this = this;

  FS.appendFile(BLASTER_PATH, "" + this.pinNum + "=0" + "\n", function(err) {
    if (err) {
      _this.emit('error', 'Error while writing to PI-Blaster file');
    } else {
      _this.emit('connect');
    }
  });
};

PwmPin.prototype.close = function() {
  var _this = this;
  FS.appendFile(BLASTER_PATH, "release " + this.pinNum + "\n", function(err) {
    _this._releaseCallback(err);
  });
};

PwmPin.prototype.closeSync = function() {
  FS.appendFileSync(BLASTER_PATH, "release " + this.pinNum + "\n");
  this._releaseCallback(false);
};

PwmPin.prototype.pwmWrite = function(duty, servo) {
  var _this = this;

  if (servo == null) {
    servo = false;
  }

  this.pbVal = (servo) ? this._servoVal(duty) : duty;

  FS.appendFile(BLASTER_PATH, "" + this.pinNum + "=" + this.pbVal + "\n", function(err) {
    if (err) {
      _this.emit('error', "Error occurred while writing value " + _this.pbVal + " to pin " + _this.pinNum);
    } else {
      _this.emit('pwmWrite', duty);
    }
  });
};

PwmPin.prototype.servoWrite = function(duty) {
  this.pwmWrite(duty, true);
};

PwmPin.prototype._releaseCallback = function(err) {
  if (err) {
    this.emit('error', 'Error while releasing pwm pin');
  } else {
    this.emit('release', this.pinNum);
  }
};

PwmPin.prototype._servoVal = function(duty) {
  var calc;
  calc = ((duty).toScale(0, 200) / 1000) + 0.05;
  calc = calc > 0.25 ? 0.25 : calc;
  calc = calc < 0.05 ? 0.05 : calc;
  return calc;
};
