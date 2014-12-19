/*jshint multistr: true */

'use strict';

var Adaptor = source('raspi');
var fs = source('raspi');

describe('Cylon.Adaptors.Raspi', function() {
  var adaptor;

  beforeEach(function() {

    adaptor = new Adaptor();

    stub(adaptor, "_cpuinfo").returns("\
      Hardware	: BCM2708\
      Revision	: 000e\
      Serial		: 00000000ca44634a"
    );
  });

  describe("#constructor", function() {
    it('should set this.pins as an object', function() {
      expect(adaptor.pins).to.be.eql({});
    });
  });


  describe("#connect", function() {
    var callback;

    beforeEach(function() {
      callback = spy();

      adaptor.connect(callback);
    });

    it('should set the this.revision number to rev2', function() {
      expect(adaptor.revision).to.be.eql('rev2');
    });
  });
});
