###
 * Cylonjs Raspi adaptor
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';

namespace = require 'node-namespace'

namespace "Cylon.Adaptor", ->
  class @Raspi extends Cylon.Basestar
    PINS= {
      3: { rev1: 0, rev2: 2 },
      5: { rev1: 1, rev2: 3 },
      7: 4,
      8: 14,
      10: 15,
      11: 17,
      12: 18,
      13: { rev1: 21, rev2: 27 },
      15: 22,
      16: 23,
      18: 24,
      19: 10,
      21: 9,
      22: 25,
      23: 11,
      24: 8,
      26: 7,
    }

    constructor: (opts) ->
      super
      @connection = opts.connection
      @name = opts.name
      @board = ""
      @pins = {}

    commands: ->
      ['pins', 'pinMode', 'digitalRead', 'digitalWrite', 'analogRead', 'analogWrite', 'pwmWrite', 'servoWrite',
       'firmwareName']
      #'sendI2CConfig', 'sendI2CWriteRequest', 'sendI2CReadRequest']

    connect: (callback) ->
      Logger.debug "Connecting to board '#{@name}'..."
      @connection.emit 'connect'
      (callback)(null)

      @proxyMethods @commands, @board, Raspi

    disconnect: ->
      Logger.debug "Disconnecting from board '#{@name}'..."
      @connection.emit 'disconnect'

    firmwareName: ->
      'Raspberry Pi'

    digitalRead: (pin, callback) ->

    digitalWrite: (pin, value) ->
      pin = @_raspiPin(pin, 'w')
      pin.on('digitalWrite', (val) =>
        @connection.emit('digitalWrite', val)
      )
      pin.on('connect', (data) =>
        pin.digitalWrite(value)
      )
      pin.connect()

    pwmWrite: (pin, value) ->

    servoWrite: (pin, value) ->

    _raspiPin: (pin, mode) ->
      pin = @_translatePin(pin)
      pins[pin] = new Cylon.IO.DigitalPin(pin: pin, mode: mode) if (pins[pin]?)
      pins[pin]

    _translatePin: (pin) ->
      PINS[pin]
