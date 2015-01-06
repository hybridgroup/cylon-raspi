// jshint expr:true
"use strict";

var I2CDevice = source("i2c-device");

describe("I2CDevice", function() {
  var device = new I2CDevice({});

  it("needs tests", function() {
    expect(device).to.be.an.instanceOf(I2CDevice);
  });
});
