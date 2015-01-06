"use strict";

var Cylon = require("cylon");

Cylon
  .robot()
  .connection("raspi", { adaptor: "raspi", port: "/dev/ttyACM0" })
  .device("servo", {
    driver: "servo",
    pin: 11,
    limits: { bottom: 20, top: 160 }
  })
  .on("ready", function(bot) {
    var angle = 30,
    increment = 40;

    setInterval(function() {
      angle += increment;
      bot.servo.angle(angle);
      console.log("Current Angle: " + (bot.servo.currentAngle()));

      if ((angle === 30) || (angle === 150)) { increment = -increment; }
    }, 1000);
  });

Cylon.start();
