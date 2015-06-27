"use strict";

var raspi = lib("../");
var Adaptor = lib("raspi");

describe("cylon-raspi", function() {
  describe("#adaptors", function() {
    it("is an array of supplied adaptors", function() {
      expect(raspi.adaptors).to.be.eql(["raspi"]);
    });
  });

  describe("#dependencies", function() {
    it("is an array of dependencies", function() {
      expect(raspi.dependencies).to.be.eql(["cylon-gpio", "cylon-i2c"]);
    });
  });

  describe("#adaptor", function() {
    it("returns an instance of the Adaptor", function() {
      expect(raspi.adaptor()).to.be.instanceOf(Adaptor);
    });
  });
});
