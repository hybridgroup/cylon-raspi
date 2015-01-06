"use strict";

var Cylon = require("cylon");

Cylon
  .robot()
  .connection("raspi", { adaptor: "raspi" })
  .device("led", { driver: "led", pin: 11 })
  .device("button", { driver: "button", pin: 7 })
  .on("ready", function(bot) {
    bot.button.on("push", function() {
      bot.led.toggle();
    });
  });

Cylon.start();
