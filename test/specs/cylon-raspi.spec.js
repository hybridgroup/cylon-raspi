'use strict';

var module = source("cylon-raspi");
var Raspi = source('raspi');

describe("Cylon.Raspi", function() {
  describe("#adaptors", function() {
    it('is an array of supplied adaptors', function() {
      expect(module.adaptors).to.be.eql(['raspi']);
    });
  });

  describe("#dependencies", function() {
    it('is an array of dependencies', function() {
      expect(module.dependencies).to.be.eql(['cylon-gpio', 'cylon-i2c']);
    });
  });

  describe("#adaptor", function() {
    it("returns an instance of the Adaptor", function() {
      expect(module.adaptor()).to.be.instanceOf(Raspi);
    });
  });
});
