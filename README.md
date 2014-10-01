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

## Available PINs

```bash
PINS = {
  3: {
    rev1: 0,
    rev2: 2
  },
  5: {
    rev1: 1,
    rev2: 3
  },
  7: 4,
  8: 14,
  10: 15,
  11: 17,
  12: 18,
  13: {
    rev1: 21,
    rev2: 27
  },
  15: 22,
  16: 23,
  18: 24,
  19: 10,
  21: 9,
  22: 25,
  23: 11,
  24: 8,
  26: 7
};
```

## Documentation
We're busy adding documentation to our web site at http://cylonjs.com/ please check there as we continue to work on Cylon.js

Thank you!

## Contributing

* All patches must be provided under the Apache 2.0 License
* Please use the -s option in git to "sign off" that the commit is your work and you are providing it under the Apache 2.0 License
* Submit a Github Pull Request to the appropriate branch and ideally discuss the changes with us in IRC.
* We will look at the patch, test it out, and give you feedback.
* Avoid doing minor whitespace changes, renamings, etc. along with merged content. These will be done by the maintainers from time to time but they can complicate merges and should be done seperately.
* Take care to maintain the existing coding style.
* Add unit tests for any new or changed functionality & Lint and test your code using [Grunt](http://gruntjs.com/).
* All pull requests should be "fast forward"
  * If there are commits after yours use “git rebase -i <new_head_branch>”
  * If you have local changes you may need to use “git stash”
  * For git help see [progit](http://git-scm.com/book) which is an awesome (and free) book on git

## Release History

Version 0.12.0 - Compatibility with Cylon 0.19.0

Version 0.11.0 - Compatibility with Cylon 0.18.0

Version 0.10.0 - Compatibility with Cylon 0.16.0

Version 0.9.1 - Add peerDependencies to package.json

Version 0.9.0 - Compatibility with Cylon 0.15.0

Version 0.8.1 - Fix a bug with PWM pins

Version 0.8.0 - Compatibility with Cylon 0.14.0, remove node-namespace.

Version 0.7.0 - Release for cylon 0.12.0

Version 0.6.2 - Fixes bug with connection not being set on adaptor.

Version 0.6.0 - Release for cylon 0.11.0, refactor into pure JavaScript, i2c bugfixes

Version 0.5.0 - Release for cylon 0.10.0

Version 0.4.0 - Release for cylon 0.9.0

Version 0.3.0 - Release for cylon 0.8.0

Version 0.2.0 - Release for cylon 0.7.0

Version 0.1.0 - Initial release

## License
Copyright (c) 2013-2014 The Hybrid Group. Licensed under the Apache 2.0 license.
