# Raspberry Pi - LED Brightness

For this example, we'll be using an LED on a Raspberry Pi board, and modifying it's
brightness to make it fade in and out. Before we start, make sure you've got the
`cylon-raspi` module installed.

Let's start by importing Cylon:

    var Cylon = require('cylon');

Once we've got that, we can start defining our robot:

    Cylon.robot({

We'll be using a Raspberry Pi as our connection. As well, we'll let our robot
know about the LED we'll be modifying, on pin #11 of the Raspberry Pi.

      connections: {
        raspi: { adaptor: 'raspi' }
      },

      devices: {
        led: { driver: 'led', pin: 11 }
      },

Next up, we'll define our robot's work:

      work: function(my) {

We'll set some variables here: brightness will represent the LED's brightness,
from 1-255, and 'fade' will be the brightness change on each tick.

        var brightness = 0,
            fade = 5;

Every 50 milliseconds, we'll be incrementing the brightness by `fade`'s value,
setting the LED to that brightness, and reversing `fade`'s value if brightness
hits 0 or 255.

        every(0.05.seconds(), function() {
          brightness += fade;
          my.led.brightness(brightness);
          if ((brightness === 0) || (brightness === 255)) { fade = -fade; }
        });
      }

And with that done, we can now start our robot.

    }).start();
