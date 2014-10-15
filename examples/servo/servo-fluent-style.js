var cylon = require('cylon');

cylon.robot({
  connection: { name: 'raspi', adaptor: 'raspi', port: '/dev/ttyACM0' },
  device: {
    name: 'servo',
    driver: 'servo',
    pin: 11,
    limits: { bottom: 20, top: 160 }
  }
})

.on('ready', function(my) {
  var angle = 30,
  increment = 40;

  setInterval(function() {
    angle += increment;
    my.servo.angle(angle);
    console.log("Current Angle: " + (my.servo.currentAngle()));

    if ((angle === 30) || (angle === 150)) { increment = -increment; }
  }, 1000);
})

.start();
