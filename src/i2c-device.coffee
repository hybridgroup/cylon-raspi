###
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict'

I2C = require 'i2c'
EventEmitter = require('events').EventEmitter

namespace = require 'node-namespace'

# I2cDevice is a wrapper for the I2c module, to make it easier to work with in the adaptors.
#
namespace 'Cylon.I2C', ->
  class @I2CDevice extends EventEmitter
    constructor: (opts) ->
      @address = opts.address
      @hdwInterface = opts.interface
      @i2cWire = new I2C(@address, { device: @hdwInterface })

    connect:
      null

    disconnect:
      null

    write: (cmd, buff, callback) ->
      @i2cWire.writeBytes(cmd, buff, callback)

    # Passes err and data params to the callback, data contains the read bytes.
    read: (cmd, length, callback) ->
      @i2cWire.readBytes(cmd, length, callback)

    writeByte: (byte, callback) ->
      @i2cWire.writeByte(byte, callback)

    # Passes err and byte params to the callback, byte contains the single byte read.
    readByte: (callback) ->
      @i2cWire.readByte(callback)
