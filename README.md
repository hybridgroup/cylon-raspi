# Cylon.js For Raspberry Pi

Cylon.js (http://cylonjs.com) is a JavaScript framework for robotics and physical computing using Node.js

This module provides an adaptor for the Raspberry Pi single board computer (http://www.raspberrypi.org/). 

Want to use Ruby on robots? Check out our sister project Artoo (http://artoo.io)

[![Build Status](https://secure.travis-ci.org/hybridgroup/cylon-raspi.png?branch=master)](http://travis-ci.org/hybridgroup/cylon-raspi)

## Getting Started

Install the module with: `npm install cylon-raspi`

## Examples

```javascript
var Cylon = require("cylon");

var robot = Cylon.robot({
  connection: { name: 'raspi', adaptor: 'raspi' },
  device: { name: 'led', driver: 'led', pin: 11 },

  work: function(my) {
    every((1).second(), function() { my.led.toggle(); });
  }
});

// start working
robot.start();
```

```coffee-script
Cylon = require('cylon')

Cylon.robot
  connection:
    name: 'raspi', adaptor: 'raspi'

  device:
    name: 'led', driver: 'led', pin: 11

  work: (my) ->
    every 1.second(), -> my.led.toggle()

.start()
```

## Documentation
We're busy adding documentation to our web site at http://cylonjs.com/ please check there as we continue to work on Cylon.js

Thank you!

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

[![NPM](https://nodei.co/npm/cylon-raspi.png?compact=true)](https://nodei.co/npm/cylon-raspi/)

Version 0.3.0 - Release for cylon 0.8.0

Version 0.2.0 - Release for cylon 0.7.0

Version 0.1.0 - Initial release

## License
Copyright (c) 2013 The Hybrid Group. Licensed under the Apache 2.0 license.
