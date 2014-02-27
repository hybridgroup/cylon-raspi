/*
 * Raspi PWM lPin
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var FS = require('fs'),
    EventEmitter = require('events').EventEmitter,
    namespace = require('node-namespace');

namespace('Cylon.IO', function() {
  this.PwmPin = (function(_parent) {
    var BLASTER_PATH;

    subclass(PwmPin, _parent);

    BLASTER_PATH = "/dev/pi-blaster";

    function PwmPin(opts) {
      this.pinNum = opts.pin;
      this.ready = false;
    }

    PwmPin.prototype.connect = function() {
      var _this = this;

      FS.appendFile(BLASTER_PATH, "" + this.pinNum + "=" + 0. + "\n", function(err) {
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

    PwmPin.prototype.pwmWrite = function(value, servo) {
      var _this = this;

      if (servo == null) {
        servo = false;
      }

      this.value = value;
      this.pbVal = (servo != null) ? this._servoVal(value) : this._pwmVal(value);

      FS.appendFile(BLASTER_PATH, "" + this.pinNum + "=" + this.pbVal + "\n", function(err) {
        if (err) {
          _this.emit('error', "Error occurred while writing value " + _this.pbVal + " to pin " + _this.pinNum);
        } else {
          _this.emit('pwmWrite', value);
        }
      });
    };

    PwmPin.prototype.servoWrite = function(angle) {
      this.pwmWrite(angle, true);
    };

    PwmPin.prototype._releaseCallback = function(err) {
      if (err) {
        this.emit('error', 'Error while releasing pwm pin');
      } else {
        this.emit('release', this.pinNum);
      }
    };

    PwmPin.prototype._pwmVal = function(value) {
      var calc;
      calc = Math.round(((1.0 / 255.0) * value) * 100) / 100;
      calc = calc > 1 ? 1 : calc;
      calc = calc < 0 ? 0 : calc;
      return calc;
    };

    PwmPin.prototype._servoVal = function(angle) {
      var calc;
      calc = Math.round((((angle * 0.20) / 180) + 0.05) * 100) / 100;
      calc = calc > 1 ? 0.249 : calc;
      calc = calc < 0.05 ? 0.05 : calc;
      return calc;
    };

    return PwmPin;

  })(EventEmitter);
});
