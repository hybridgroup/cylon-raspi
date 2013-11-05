/*
 * Cylonjs Raspi adaptor
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var namespace,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  namespace = require('node-namespace');

  namespace("Cylon.Adaptor", function() {
    return this.Raspi = (function(_super) {
      __extends(Raspi, _super);

      function Raspi(opts) {
        Raspi.__super__.constructor.apply(this, arguments);
        this.connection = opts.connection;
        this.name = opts.name;
        this.board = "";
      }

      Raspi.prototype.commands = function() {
        return ['pins', 'pinMode', 'digitalRead', 'digitalWrite', 'analogRead', 'analogWrite', 'pwmWrite', 'servoWrite', 'firmwareName'];
      };

      Raspi.prototype.connect = function(callback) {
        Logger.debug("Connecting to board '" + this.name + "'...");
        this.board = null;
        return this.proxyMethods(this.commands, this.board, Raspi);
      };

      Raspi.prototype.disconnect = function() {
        Logger.debug("Disconnecting from board '" + this.name + "'...");
        return this.board.close;
      };

      Raspi.prototype.firmwareName = function() {
        return 'Raspberry Pi';
      };

      Raspi.prototype.digitalRead = function(pin, callback) {
        this.board.pinMode(pin, this.board.MODES.INPUT);
        return this.board.digitalRead(pin, callback);
      };

      Raspi.prototype.digitalWrite = function(pin, value) {
        this.board.pinMode(pin, this.board.MODES.OUTPUT);
        return this.board.digitalWrite(pin, value);
      };

      Raspi.prototype.analogRead = function(pin, callback) {
        return this.board.analogRead(pin, callback);
      };

      Raspi.prototype.analogWrite = function(pin, value) {
        this.board.pinMode(this.board.analogPins[pin], this.board.MODES.ANALOG);
        return this.board.analogWrite(this.board.analogPins[pin], value);
      };

      Raspi.prototype.pwmWrite = function(pin, value) {
        this.board.pinMode(pin, this.board.MODES.PWM);
        return this.board.analogWrite(pin, value);
      };

      Raspi.prototype.servoWrite = function(pin, value) {
        this.board.pinMode(pin, this.board.MODES.SERVO);
        return this.board.analogWrite(pin, value);
      };

      return Raspi;

    })(Cylon.Basestar);
  });

}).call(this);
