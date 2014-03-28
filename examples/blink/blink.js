var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'raspi', adaptor: 'raspi' },
  device: { name: 'led', driver: 'led', pin: 11 },

  work: function(my) {
    every((1).second(), my.led.toggle);
  }
}).start();
