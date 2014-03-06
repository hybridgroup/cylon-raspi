var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'raspi', adaptor: 'raspi' },
  device: { name: 'pixel', driver: 'blinkm' },

  work: function(my) {
    my.pixel.stopScript();
    my.pixel.goToRGB(255, 0, 0);
    my.pixel.fadeToRGB(0, 255, 0);
    my.pixel.fadeToRGB(0, 0, 255);

    var color = my.pixel.getRGBColor();

    console.log(color);

    my.pixel.getRGBColor(function(err, data) {
      if (err == null) { console.log(data); }
    });
  }
}).start();
