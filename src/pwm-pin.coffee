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
      FS.writeFile(BLASTER_PATH, "#{ @pinNum }=#{ 0 }\n", (err) =>
        if(err)
          @emit('error', 'Error while writing to PI-Blaster file')
      )

    release: ->
      FS.writeFile(BLASTER_PATH, "release #{ @pinNum }", (err) =>
        @_releaseCallback(err)
      )

    relaseSync: ->
      FS.writeFileSync(BLASTER_PATH, "release #{ @pinNum }")
      @_releaseCallback(false)

    # Writes PWM value to the specified pin
    # Param value should be integer from 0 to 255
    pwmWrite: (value) ->
      @value = value
      @pbVal = @_piBlasterValue(value)

      FS.writeFile(BLASTER_PATH, @pb_val, (err) =>
        if (err)
          @emit('error', "Error occurred while writing value #{ @pbVal } to pin #{ @pinNum }")
        else
          @emit('pwmWrite', value)
      )

    _releaseCallback: () ->
      if(err)
        @emit('error', 'Error while releasing pwm pin')
      else
        @emit('release', @pinNum)

    _piBlasterVal: (value) ->
      calc = Math.round(((1.0/255.0) * value) * 100) / 100
      calc = (calc > 1) ? 1 : calc
      calc = (calc < 0) ? 0 : calc
      calc
