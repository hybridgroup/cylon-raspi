"use strict";

var I2CDevice = lib("i2c-device"),
    MockI2C = lib("i2c");

var EventEmitter = require("events").EventEmitter;

function compareBuffers(a, b) {
  if (!Buffer.isBuffer(a)) {
    return undefined;
  }

  if (!Buffer.isBuffer(b)) {
    return undefined;
  }

  if (typeof a.equals === "function") {
    return a.equals(b);
  }

  if (a.length !== b.length) {
    return false;
  }

  for (var i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

describe("I2CDevice", function() {
  var device, wire;

  beforeEach(function() {
    MockI2C.openSync = function() {
    };

    device = new I2CDevice({
      address: 0x4A,
      bus: 1
    });
    device.connect();
  });

  it("is an EventEmitter", function() {
    expect(device).to.be.an.instanceOf(EventEmitter);
  });

  describe("constructor", function() {
    it("sets @address to the provided address", function() {
      expect(device.address).to.be.eql(0x4A);
    });

    it("sets @bus to the provided interface", function() {
      expect(device.bus).to.be.eql(1);
    });
  });

  describe("#write", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      wire = device.i2cWire = { i2cWrite: spy() };
      device.write("command", [1, 2, 3], callback);
    });

    it("writes a set of bytes to the I2C connection", function() {
      var call = wire.i2cWrite.firstCall;

      var bufsMatch = compareBuffers(
        new Buffer(["command"].concat([1, 2, 3])),
        call.args[2]
      );

      expect(bufsMatch).to.be.eql(true);
      expect(call.args[3]).to.be.eql(callback);
    });
  });

  describe("#read", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      wire = device.i2cWire = { readI2cBlock: spy() };
      device.read("c", 1024, callback);
    });

    it("reads register from I2C connection", function() {
      var call = wire.readI2cBlock.firstCall;

      expect(call.args[0]).to.be.eql(0x4A);
      expect(call.args[1]).to.be.eql("c");
      expect(call.args[2]).to.be.eql(1024);
    });
  });

  describe("#writeByte", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      wire = device.i2cWire = { sendByte: spy() };
      device.writeByte(1, callback);
    });

    it("writes a single byte to the I2C connection", function() {
      expect(wire.sendByte).to.be.calledWith(0x4A, 1, callback);
    });
  });

  describe("#readByte", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      wire = device.i2cWire = { receiveByte: spy() };
      device.readByte(callback);
    });

    it("reads a single byte from the I2C connection", function() {
      expect(wire.receiveByte).to.be.calledWith(0x4A, callback);
    });
  });
});
