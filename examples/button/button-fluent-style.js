var cylon = require('cylon');

cylon.robot({
  connection: { name: 'raspi', adaptor: 'raspi' },
  devices: {
    led: { driver: 'led', pin: 11 },
    button: { driver: 'button', pin: 7 }
  }
})

.on('ready', function(robot) {
  robot.button.on('push', function() {
    robot.led.toggle();
  });
})

.start();
