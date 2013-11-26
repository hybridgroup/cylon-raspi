/*
 * Raspi PWM lPin
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var EventEmitter, FS, namespace,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FS = require('fs');

  EventEmitter = require('events').EventEmitter;

  namespace = require('node-namespace');

  namespace('Cylon.IO', function() {
    return this.PwmPin = (function(_super) {
      var BLASTER_PATH;

      __extends(PwmPin, _super);

      BLASTER_PATH = "/dev/pi-blaster";

      function PwmPin(opts) {
        this.pinNum = opts.pin;
        this.ready = false;
      }

      PwmPin.prototype.connect = function() {
        var _this = this;
        return FS.writeFile(BLASTER_PATH, "" + this.pinNum + "=" + 0. + "\n", function(err) {
          if (err) {
            return _this.emit('error', 'Error while writing to PI-Blaster file');
          } else {
            return _this.emit('connect');
          }
        });
      };

      PwmPin.prototype.close = function() {
        var _this = this;
        return FS.writeFile(BLASTER_PATH, "release " + this.pinNum, function(err) {
          return _this._releaseCallback(err);
        });
      };

      PwmPin.prototype.closeSync = function() {
        FS.writeFileSync(BLASTER_PATH, "release " + this.pinNum);
        return this._releaseCallback(false);
      };

      PwmPin.prototype.pwmWrite = function(value) {
        var _this = this;
        this.value = value;
        this.pbVal = this._piBlasterVal(value);
        return FS.writeFile(BLASTER_PATH, "" + this.pinNum + "=" + this.pb_val, function(err) {
          if (err) {
            return _this.emit('error', "Error occurred while writing value " + _this.pbVal + " to pin " + _this.pinNum);
          } else {
            return _this.emit('pwmWrite', value);
          }
        });
      };

      PwmPin.prototype._releaseCallback = function(err) {
        if (err) {
          return this.emit('error', 'Error while releasing pwm pin');
        } else {
          return this.emit('release', this.pinNum);
        }
      };

      PwmPin.prototype._piBlasterVal = function(value) {
        var calc, _ref, _ref1;
        calc = Math.round(((1.0 / 255.0) * value) * 100) / 100;
        calc = (_ref = calc > 1) != null ? _ref : {
          1: calc
        };
        calc = (_ref1 = calc < 0) != null ? _ref1 : {
          0: calc
        };
        return calc;
      };

      return PwmPin;

    })(EventEmitter);
  });

}).call(this);
