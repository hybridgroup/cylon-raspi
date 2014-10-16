var cylon = require('cylon');

cylon.robot({
  connection: { name: 'raspi', adaptor: 'raspi' },
  device: { name: 'led', driver: 'led', pin: 11 }
})

.on('ready', function(robot) {
  setInterval(function() {
    robot.led.toggle();
  }, 1000);
})

.start();
