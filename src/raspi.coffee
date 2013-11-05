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
    constructor: (opts) ->
      super
      @connection = opts.connection
      @name = opts.name
      @board = ""

    commands: ->
      ['pins', 'pinMode', 'digitalRead', 'digitalWrite', 'analogRead', 'analogWrite', 'pwmWrite', 'servoWrite',
       'firmwareName']
      #'sendI2CConfig', 'sendI2CWriteRequest', 'sendI2CReadRequest']

    connect: (callback) ->
      Logger.debug "Connecting to board '#{@name}'..."
      @board = null

      @proxyMethods @commands, @board, Raspi

    disconnect: ->
      Logger.debug "Disconnecting from board '#{@name}'..."
      @board.close

    firmwareName: ->
      'Raspberry Pi'

    digitalRead: (pin, callback) ->
      @board.pinMode pin, @board.MODES.INPUT
      @board.digitalRead pin, callback

    digitalWrite: (pin, value) ->
      @board.pinMode pin, @board.MODES.OUTPUT
      @board.digitalWrite pin, value

    analogRead: (pin, callback) ->
      @board.analogRead(pin, callback)

    analogWrite: (pin, value) ->
      @board.pinMode @board.analogPins[pin], @board.MODES.ANALOG
      @board.analogWrite @board.analogPins[pin], value

    pwmWrite: (pin, value) ->
      @board.pinMode pin, @board.MODES.PWM
      @board.analogWrite pin, value

    servoWrite: (pin, value) ->
      @board.pinMode pin, @board.MODES.SERVO
      @board.analogWrite pin, value
