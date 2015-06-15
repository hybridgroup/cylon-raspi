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
    device = new I2CDevice({
      address: 0x4A,
      "interface": "interface"
    });
  });

  it("is an EventEmitter", function() {
    expect(device).to.be.an.instanceOf(EventEmitter);
  });

  describe("constructor", function() {
    it("sets @address to the provided address", function() {
      expect(device.address).to.be.eql(0x4A);
    });

    it("sets @hdwInterface to the provided interface", function() {
      expect(device.hdwInterface).to.be.eql("interface");
    });

    it("sets @i2cWire to a new I2C interface", function() {
      var i2cwire = device.i2cWire;
      expect(i2cwire).to.be.an.instanceOf(MockI2C);
      expect(i2cwire.address).to.be.eql(0x4A);
      expect(i2cwire.device).to.be.eql("interface");
    });
  });

  describe("#write", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      wire = device.i2cWire = { write: spy() };
      device.write("command", [1, 2, 3], callback);
    });

    it("writes a set of bytes to the I2C connection", function() {
      var call = wire.write.firstCall;

      var bufsMatch = compareBuffers(
        new Buffer(["command"].concat([1, 2, 3])),
        call.args[0]
      );

      expect(bufsMatch).to.be.eql(true);
      expect(call.args[1]).to.be.eql(callback);
    });
  });

  describe("#read", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      wire = device.i2cWire = { write: spy(), read: spy() };
      device.read("command", 1024, callback);
    });

    it("writes a command to the I2C connection", function() {
      var call = wire.write.firstCall;

      var bufsMatch = compareBuffers(
        new Buffer(["command"]),
        call.args[0]
      );

      expect(bufsMatch).to.be.eql(true);
    });

    context("if the write fails", function() {
      beforeEach(function() {
        wire.write.yield("error!");
      });

      it("triggers the callback with an error", function() {
        expect(callback).to.be.calledWith("error!", null);
      });
    });

    context("if the write succeeds", function() {
      beforeEach(function() {
        wire.write.yield(null);
      });

      it("reads the specified data from the I2C device", function() {
        expect(wire.read).to.be.calledWith(1024, callback);
      });
    });
  });

  describe("#writeByte", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      wire = device.i2cWire = { writeByte: spy() };
      device.writeByte(1, callback);
    });

    it("writes a single byte to the I2C connection", function() {
      expect(wire.writeByte).to.be.calledWith(1, callback);
    });
  });

  describe("#readByte", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      wire = device.i2cWire = { readByte: spy() };
      device.readByte(callback);
    });

    it("reads a single byte from the I2C connection", function() {
      expect(wire.readByte).to.be.calledWith(callback);
    });
  });
});
