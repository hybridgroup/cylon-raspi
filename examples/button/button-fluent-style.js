var cylon = require('cylon');

cylon.robot({
  connection: { name: 'raspi', adaptor: 'raspi' },
  devices: [
    { name: 'led', driver: 'led', pin: 11 },
    { name: 'button', driver: 'button', pin: 7 }
  ]
})

.on('ready', function(robot) {
  robot.button.on('push', function() {
    robot.led.toggle();
  });
})

.start();
