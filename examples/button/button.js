var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'raspi', adaptor: 'raspi' },
  devices: [
    { name: 'led', driver: 'led', pin: 11 },
    { name: 'button', driver: 'button', pin: 7 }
  ],

  work: function(my) {
    my.button.on('push', my.led.toggle);
  }
}).start();
