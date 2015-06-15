"use strict";

var PwmPin = lib("pwm-pin");

describe("PwmPin", function() {
  var pin = new PwmPin({});

  it("needs tests", function() {
    expect(pin).to.be.an.instanceOf(PwmPin);
  });
});
