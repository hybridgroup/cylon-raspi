"use strict";

var Cylon = require("cylon");

Cylon
  .robot()
  .connection("raspi", { adaptor: "raspi" })
  .device("led", { driver: "led", pin: 11 })

  .on("ready", function(bot) {
    setInterval(function() {
      bot.led.toggle();
    }, 1000);
  });

Cylon.start();
