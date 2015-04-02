// jshint expr:true
"use strict";

var Cylon = require("cylon");

var Raspi = source("raspi");

describe("Cylon.Adaptors.Raspi", function() {
  var adaptor;

  beforeEach(function() {
    adaptor = new Raspi();
  });

  it("is an instance of Cylon.Adaptor", function() {
    expect(adaptor).to.be.an.instanceOf(Raspi);
    expect(adaptor).to.be.an.instanceOf(Cylon.Adaptor);
  });

  describe("constructor", function() {
    it("sets @board to empty string by default", function() {
      expect(adaptor.board).to.be.eql("");
    });

    it("sets @pins to an empty object by default", function() {
      expect(adaptor.pins).to.be.eql({});
    });

    it("sets @pwmPins to an empty object by default", function() {
      expect(adaptor.pwmPins).to.be.eql({});
    });

    it("sets @i2cDevices to an empty object by default", function() {
      expect(adaptor.i2cDevices).to.be.eql({});
    });
  });

  describe("#commands", function() {
    it("is an array of Raspi commands", function() {
      expect(adaptor.commands).to.be.an("array");

      adaptor.commands.forEach(function(cmd) {
        expect(cmd).to.be.a("string");
      });
    });
  });

  describe("#connect", function() {
    var callback;

    beforeEach(function() {
      callback = spy();

      adaptor.proxyMethods = spy();
      adaptor._cpuinfo = stub().returns("Revision : 000e");
      adaptor.connect(callback);
    });

    it("proxies methods to the board", function() {
      expect(adaptor.proxyMethods).to.be.calledWith(
        adaptor.commands,
        adaptor.board,
        adaptor
      );
    });

    it("sets @revision based on CPU info", function() {
      expect(adaptor.revision).to.be.eql("rev2");

      adaptor._cpuinfo.returns("Revision : 0001");
      adaptor.connect(callback);
      expect(adaptor.revision).to.be.eql("rev1");

      adaptor._cpuinfo.returns("Revision : 0100");
      adaptor.connect(callback);
      expect(adaptor.revision).to.be.eql("rev3");
    });

    it("sets @i2cInterface based on CPU info", function() {
      expect(adaptor.i2cInterface).to.be.eql("/dev/i2c-1");

      adaptor._cpuinfo.returns("Revision : 0001");
      adaptor.connect(callback);
      expect(adaptor.i2cInterface).to.be.eql("/dev/i2c-0");
    });

    it("triggers the callback", function() {
      expect(callback).to.be.called;
    });
  });

  describe("#disconnect", function() {
    var disconnect, callback;

    beforeEach(function() {
      disconnect = spy();
      callback = spy();

      adaptor.on("disconnect", disconnect);

      adaptor._disconnectPins = spy();

      adaptor.disconnect(callback);
    });

    it("disconnects all pins", function() {
      expect(adaptor._disconnectPins).to.be.called;
    });

    it("emits 'disconnect'", function() {
      expect(disconnect).to.be.called;
    });

    it("triggers the callback", function() {
      expect(callback).to.be.called;
    });
  });
});
