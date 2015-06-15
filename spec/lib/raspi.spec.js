"use strict";

var Cylon = require("cylon");

var fs = require("fs");

var Raspi = lib("raspi"),
    I2CDevice = lib("i2c-device"),
    PwmPin = lib("pwm-pin");

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

  describe("#firmwareName", function() {
    it("returns 'Raspberry Pi'", function() {
      expect(adaptor.firmwareName()).to.be.eql("Raspberry Pi");
    });
  });

  describe("#digitalRead", function() {
    var pin, callback;

    beforeEach(function() {
      callback = spy();

      pin = { on: stub(), digitalRead: stub(), connect: stub() };

      adaptor._digitalPin = stub().returns(pin);

      adaptor.respond = spy();

      adaptor.digitalRead(3, callback);
    });

    it("sets the pin to read mode", function() {
      expect(adaptor._digitalPin).to.be.calledWith(3);
    });

    it("attaches a listener for 'digitalRead'", function() {
      expect(pin.on).to.be.calledWith("digitalRead");
    });

    it("attaches a listener for 'connect'", function() {
      expect(pin.on).to.be.calledWith("connect");
    });

    it("connects to the pin", function() {
      expect(pin.connect).to.be.called;
    });

    describe("when 'connect' is triggered", function() {
      beforeEach(function() {
        pin.on.withArgs("connect").yield();
      });

      it("calls #digitalRead on the pin", function() {
        expect(pin.digitalRead).to.be.calledWith(20);
      });
    });

    describe("when 'digitalRead' is triggered", function() {
      beforeEach(function() {
        pin.on.withArgs("digitalRead").yield(1);
      });

      it("responds with the pin value", function() {
        expect(adaptor.respond).to.be.calledWith(
          "digitalRead",
          callback,
          null,
          1,
          3
        );
      });
    });
  });

  describe("#digitalWrite", function() {
    var pin, callback;

    beforeEach(function() {
      callback = spy();

      pin = { on: stub(), digitalWrite: stub(), connect: stub() };

      adaptor._digitalPin = stub().returns(pin);

      adaptor.respond = spy();

      adaptor.digitalWrite(3, 1, callback);
    });

    it("sets the pin to Write mode", function() {
      expect(adaptor._digitalPin).to.be.calledWith(3);
    });

    it("attaches a listener for 'digitalWrite'", function() {
      expect(pin.on).to.be.calledWith("digitalWrite");
    });

    it("attaches a listener for 'connect'", function() {
      expect(pin.on).to.be.calledWith("connect");
    });

    it("connects to the pin", function() {
      expect(pin.connect).to.be.called;
    });

    describe("when 'connect' is triggered", function() {
      beforeEach(function() {
        pin.on.withArgs("connect").yield();
      });

      it("calls #digitalWrite on the pin", function() {
        expect(pin.digitalWrite).to.be.calledWith(1);
      });
    });

    describe("when 'digitalWrite' is triggered", function() {
      beforeEach(function() {
        pin.on.withArgs("digitalWrite").yield(1);
      });

      it("responds with the pin value", function() {
        expect(adaptor.respond).to.be.calledWith(
          "digitalWrite",
          callback,
          null,
          1,
          3
        );
      });
    });
  });

  describe("#i2cWrite", function() {
    var device, callback;

    beforeEach(function() {
      callback = spy();

      device = { write: stub() };

      adaptor.respond = stub();
      adaptor._i2cDevice = stub().returns(device);

      adaptor.i2cWrite(0x4a, "cmd", [1, 2, 3], callback);
    });

    it("writes a command and buffer to an i2c device", function() {
      expect(adaptor._i2cDevice).to.be.calledWith(0x4a);
      expect(device.write).to.be.calledWith("cmd", [1, 2, 3]);

      adaptor.i2cWrite(0x4a, "cmd");
      expect(device.write).to.be.calledWith("cmd", []);
    });

    describe("when done writing", function() {
      beforeEach(function() {
        device.write.yield();
      });

      it("responds with the address, command, and buffer", function() {
        expect(adaptor.respond).to.be.calledWith(
          "i2cWrite", callback, null, 0x4a, "cmd", [1, 2, 3]
        );
      });
    });
  });

  describe("#i2cRead", function() {
    var device, callback;

    beforeEach(function() {
      callback = spy();

      device = { read: stub() };

      adaptor.respond = stub();
      adaptor._i2cDevice = stub().returns(device);

      adaptor.i2cRead(0x4a, "cmd", 1024, callback);
    });

    it("reads from an i2c device", function() {
      expect(adaptor._i2cDevice).to.be.calledWith(0x4a);
      expect(device.read).to.be.calledWith("cmd", 1024);
    });

    describe("when done reading", function() {
      beforeEach(function() {
        device.read.yield("err", "data");
      });

      it("responds with the error and data", function() {
        expect(adaptor.respond).to.be.calledWith(
          "i2cRead", callback, "err", "data"
        );
      });
    });
  });

  describe("#_i2cDevice", function() {
    context("if the device already exists", function() {
      beforeEach(function() {
        adaptor.i2cDevices[0x4a] = "a device";
      });

      it("returns it", function() {
        expect(adaptor._i2cDevice(0x4a)).to.be.eql("a device");
      });
    });

    context("if the device doesn't exist", function() {
      it("creates a new one", function() {
        expect(adaptor.i2cDevices[0x4a]).to.be.undefined;
        adaptor._i2cDevice(0x4a);
        expect(adaptor.i2cDevices[0x4a]).to.be.an.instanceOf(I2CDevice);
      });
    });
  });

  describe("#_pwmWrite", function() {
    var pin, callback;

    beforeEach(function() {
      pin = { on: stub(), servoWrite: stub(), pwmWrite: stub() };
      callback = spy();

      adaptor._pwmPin = stub().returns(pin);
      adaptor.respond = stub();

      adaptor._pwmWrite(10, 1, callback);
    });

    it("calls #_pwmPin to get the pin", function() {
      expect(adaptor._pwmPin).to.be.called;
    });

    it("calls pin#pwmWrite with the provided value", function() {
      expect(pin.pwmWrite).to.be.calledWith(1);
    });

    context("when the 'pwmWrite' event is triggered", function() {
      beforeEach(function() {
        pin.on.withArgs("pwmWrite").yield();
      });

      it("responds with the written value", function() {
        expect(adaptor.respond).to.be.calledWith(
          "pwmWrite", callback, null, 1, 10
        );
      });
    });

    context("when 'type' is 'servo'", function() {
      beforeEach(function() {
        adaptor._pwmWrite(12, 0, callback, "servo");
        pin.on.withArgs("pwmWrite").yield();
      });

      it("calls pin#servoWrite", function() {
        expect(pin.servoWrite).to.be.calledWith(0);
      });

      it("responds with 'servoWrite' when done", function() {
        expect(adaptor.respond).to.be.calledWith(
          "servoWrite", callback, null, 0, 12
        );
      });
    });
  });

  describe("#pwmWrite", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      adaptor._pwmWrite = spy();

      adaptor.pwmWrite(10, 20, callback);
    });

    it("calls #_pwmWrite", function() {
      expect(adaptor._pwmWrite).to.be.calledWith(10, 20, callback, "pwm");
    });
  });

  describe("#servoWrite", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      adaptor._pwmWrite = spy();

      adaptor.servoWrite(10, 20, callback);
    });

    it("calls #_pwmWrite", function() {
      expect(adaptor._pwmWrite).to.be.calledWith(10, 20, callback, "servo");
    });
  });

  describe("_pwmPin", function() {
    beforeEach(function() {
      adaptor._translatePin = function(n) { return n + 1; };
    });

    context("if the pin is already initialized", function() {
      beforeEach(function() {
        adaptor.pwmPins[7] = "pwm pin";
      });

      it("returns it", function() {
        expect(adaptor._pwmPin(6)).to.be.eql("pwm pin");
      });
    });

    context("if the pin isn't initialized", function() {
      it("instantiates a PwmPin", function() {
        var pin = adaptor._pwmPin(6);
        expect(pin).to.be.an.instanceOf(PwmPin);
        expect(pin).to.be.eql(adaptor.pwmPins[7]);
      });
    });
  });

  describe("_digitalPin", function() {
    beforeEach(function() {
      adaptor._translatePin = function(n) { return n + 1; };
    });

    context("if the pin is already initialized", function() {
      beforeEach(function() {
        adaptor.pins[7] = "digital pin";
      });

      it("returns it", function() {
        expect(adaptor._digitalPin(6)).to.be.eql("digital pin");
      });
    });

    context("if the pin isn't initialized", function() {
      it("instantiates a digitalPin", function() {
        var pin = adaptor._digitalPin(6);
        expect(pin).to.be.an.instanceOf(Cylon.IO.DigitalPin);
        expect(pin).to.be.eql(adaptor.pins[7]);
      });
    });
  });

  describe("#_translatePin", function() {
    it("translates pin numbers based on board revision", function() {
      expect(adaptor._translatePin(7)).to.be.eql(4);

      adaptor.revision = "rev1";
      expect(adaptor._translatePin(3)).to.be.eql(0);

      adaptor.revision = "rev3";
      expect(adaptor._translatePin(3)).to.be.eql(2);
    });
  });

  describe("_disconnectPins", function() {
    function mockPin() {
      return { closeSync: spy() };
    }

    it("closes all pins and pwmPins", function() {
      var pins = adaptor.pins = [ mockPin(), mockPin(), mockPin() ];
      var pwmPins = adaptor.pwmPins = [ mockPin(), mockPin(), mockPin() ];

      adaptor._disconnectPins();

      pins.forEach(function(pin) {
        expect(pin.closeSync).to.be.called;
      });

      pwmPins.forEach(function(pin) {
        expect(pin.closeSync).to.be.called;
      });
    });
  });

  describe("#_cpuinfo", function() {
    beforeEach(function() {
      stub(fs, "readFileSync").returns("cpu info");
    });

    afterEach(function() {
      fs.readFileSync.restore();
    });

    it("reads from /proc/cpuinfo", function() {
      var res = adaptor._cpuinfo();

      expect(fs.readFileSync).to.be.called;
      expect(res).to.be.eql("cpu info");
    });
  });
});
