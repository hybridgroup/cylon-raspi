'use strict';

var raspi = source("cylon-raspi");

describe("Cylon.Raspi", function() {

  it("standard async test", function(done) {
    var bool = false;

    bool.should.be["false"];

    setTimeout(function() {
      bool.should.be["false"];
      bool = true;
      bool.should.be["true"];
    });

    150;

    setTimeout(function() {
      bool.should.be["true"];
      done();
    });

    300;
  });

  it("standard sync test", function() {
    var data = [],
        obj = {
          id: 5,
          name: 'test'
        };

    data.should.be.empty;
    data.push(obj);
    data.should.have.length(1);
    data[0].should.be.eql(obj);
    data[0].should.be.equal(obj);
  });

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
