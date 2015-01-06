"use strict";

var Cylon = require("cylon");

Cylon.robot({
  connections: {
    raspi: { adaptor: "raspi", port: "/dev/ttyACM0" }
  },

  devices: {
    servo: {
      driver: "servo",
      pin: 11,
      limits: { bottom: 20, top: 160 }
    }
  },

  work: function(my) {
    var angle = 30,
        increment = 40;

    every((1).seconds(), function() {
      angle += increment;
      my.servo.angle(angle);
      console.log("Current Angle: " + (my.servo.currentAngle()));

      if ((angle === 30) || (angle === 150)) { increment = -increment; }
    });
  }
}).start();
