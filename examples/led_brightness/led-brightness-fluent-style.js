var cylon = require('cylon');

cylon.robot({
  connection: { name: 'raspi', adaptor: 'raspi', port: '/dev/ttyACM0' },
  device: { name: 'led', driver: 'led', pin: 11 }
})

.on('ready', function(my) {
  var brightness = 0,
  fade = 5;

  setInterval(function() {
    brightness += fade;
    my.led.brightness(brightness);
    if ((brightness === 0) || (brightness === 255)) { fade = -fade; }
  }, 50);
})

.start();
