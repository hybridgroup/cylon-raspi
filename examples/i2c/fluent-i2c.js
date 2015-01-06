"use strict";

var Cylon = require("cylon");

Cylon
  .robot()
  .connection("blinkm", { adaptor: "raspi" })
  .device("pixel", { driver: "blinkm" })

  .on("ready", function(bot) {
    // Before you can use and work with I2C in the raspberry pi you
    // need to configure it, follow the instructions to enable it here:
    //
    // http://learn.adafruit.com/adafruits-raspberry-pi-lesson-4-gpio-setup/configuring-i2c

    // We first stop the BlinkM light script
    bot.pixel.stopScript();

    // You can pass a callback to all blinkm functions as the last param,
    // If you do the command would be executed asynchronously.
    // For write operations you get an (err) param passed back,
    // null/undefined for success, and containing the error y any encountered.

    // BlimkM  Write Commands.
    //   bot.pixel.goToRGB(255, 0, 0)
    //   bot.pixel.fadeToRGB(0, 255, 0)
    //   bot.pixel.fadeToRGB(0, 0, 255)
    //   bot.pixel.fadeToHSB(100, 180, 90)
    //   bot.pixel.fadeToRandomRGB(0, 0, 255)
    //   bot.pixel.fadeToRandomHSB(100, 180, 90)
    //   bot.pixel.playLightScript(1, 0, 0)
    //   bot.pixel.stopScript()
    //   bot.pixel.setFadeSpeed(50)
    //   bot.pixel.setTimeAdjust(50)

    bot.pixel.goToRGB(255, 0, 0);
    bot.pixel.fadeToRGB(0, 255, 0);
    bot.pixel.fadeToRGB(0, 0, 255);


    // For read commands you get (err, data) passed back to the callback,
    // data contains the read data buffer, in case of Sync call (no callback)
    // you get a regular return with the data buffer.
    var color = bot.pixel.getRGBColor();
    console.log(color);

    // Example getting the color usinc async call and a callback
    bot.pixel.getRGBColor(function(err, data) {
      if (err == null) { console.log(data); }
    });
  });

Cylon.start();
