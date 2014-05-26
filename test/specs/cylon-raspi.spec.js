'use strict';

var raspi = source("cylon-raspi");

describe("Cylon.Raspi", function() {
  it("can register", function() {
    raspi.register.should.be.a('function');
  });

  it("can create an adaptor", function() {
    raspi.adaptor.should.be.a('function');
  });

  it("can create a driver", function() {
    raspi.driver.should.be.a('function');
  });
});
