(function() {
  'use strict';
  var raspi;

  raspi = source("cylon-raspi");

  describe("Cylon.Raspi", function() {
    it("standard async test", function(done) {
      var bool;
      bool = false;
      bool.should.be["false"];
      setTimeout(function() {
        bool.should.be["false"];
        bool = true;
        return bool.should.be["true"];
      });
      150;
      setTimeout(function() {
        bool.should.be["true"];
        return done();
      });
      return 300;
    });
    it("standard sync test", function() {
      var data, obj;
      data = [];
      obj = {
        id: 5,
        name: 'test'
      };
      data.should.be.empty;
      data.push(obj);
      data.should.have.length(1);
      data[0].should.be.eql(obj);
      return data[0].should.be.equal(obj);
    });
    it("can register", function() {
      return raspi.register.should.be.a('function');
    });
    it("can create an adaptor", function() {
      return raspi.adaptor.should.be.a('function');
    });
    return it("can create a driver", function() {
      return raspi.driver.should.be.a('function');
    });
  });

}).call(this);
