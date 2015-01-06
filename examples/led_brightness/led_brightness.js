"use strict";

var Cylon = require("cylon");

Cylon.robot({
  connections: {
    raspi: { adaptor: "raspi", port: "/dev/ttyACM0" }
  },

  devices: {
    led: { driver: "led", pin: 11 }
  },

  work: function(my) {
    var brightness = 0,
        fade = 5;

    every((0.05).seconds(), function() {
      brightness += fade;
      my.led.brightness(brightness);
      if ((brightness === 0) || (brightness === 255)) { fade = -fade; }
    });
  }
}).start();
