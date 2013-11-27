###
 * Raspi PWM lPin
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';

FS = require('fs')
EventEmitter = require('events').EventEmitter

namespace = require 'node-namespace'

# PwmPin class to interface with Pi-Blaster in the raspberry-pi
#
namespace 'Cylon.IO', ->
  class @PwmPin extends EventEmitter

    BLASTER_PATH = "/dev/pi-blaster"

    constructor: (opts) ->
      @pinNum = opts.pin
      @ready = false

    connect: () ->
      FS.appendFile(BLASTER_PATH, "#{ @pinNum }=#{ 0 }\n", (err) =>
        if(err)
          @emit('error', 'Error while writing to PI-Blaster file')
        else
          @emit('connect')
      )

    close: ->
      FS.appendFile(BLASTER_PATH, "release #{ @pinNum }\n", (err) =>
        @_releaseCallback(err)
      )

    closeSync: ->
      FS.appendFileSync(BLASTER_PATH, "release #{ @pinNum }\n")
      @_releaseCallback(false)

    # Writes PWM value to the specified pin
    # Param value should be integer from 0 to 255
    pwmWrite: (value, servo = false) ->
      @value = value
      @pbVal = if (servo?) then @_servoVal(value) else @_pwmVal(value)

      FS.appendFile(BLASTER_PATH, "#{ @pinNum }=#{ @pbVal }\n", (err) =>
        if (err)
          @emit('error', "Error occurred while writing value #{ @pbVal } to pin #{ @pinNum }")
        else
          @emit('pwmWrite', value)
      )

    servoWrite: (angle) ->
      @pwmWrite(angle, true)

    _releaseCallback: (err) ->
      if(err)
        @emit('error', 'Error while releasing pwm pin')
      else
        @emit('release', @pinNum)

    _pwmVal: (value) ->
      calc = Math.round(((1.0/255.0) * value) * 100) / 100
      calc = if (calc > 1) then 1 else calc
      calc = if (calc < 0) then 0 else calc
      calc

    _servoVal: (angle) ->
      calc = Math.round(((angle*0.25) / 180) * 100) / 100
      calc = if (calc > 1) then 0.25 else calc
      calc = if (calc < 0) then 0 else calc
      calc
