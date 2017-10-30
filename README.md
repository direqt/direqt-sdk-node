# Direqt Software Development Kit for JavaScript
[![Build Status](https://travis-ci.org/direqt/direqt-sdk-js.svg?branch=master)](https://travis-ci.org/direqt/direqt-sdk-js)

Direqt is a platform for integrating advertisements into conversational media.

The Direqt Software Development Kit (SDK) for JavaScript contains library code, utilities, and examples designed to enable developers to build applications using Direqt and JavaScript. This SDK supports only server-side JavaScript (i.e. Node.js).

    npm install -g direqt              # Install globally on developer machine
    direqt register                    # register a Direqt publisher account
    direqt generate-api-key --global   # get an API key 
    direqt signin                      # authenticate and save API token in config
    npm install --save direqt          # install in NPM-based project

### Quick Peek

Here's a Node.js application that fetches a test advertisement and writes it to the console:

```JavaScript
var direqt = require('direqt');
var config = {
  apiKey: direqt.DEMO_API_KEY,
  apiSecret: direqt.DEMO_API_SECRET,
};
direqt = direqt(config);

direqt.fetch(direqt.DEMO_PLACEMENT_ID)
  .then(ad => console.log(ad.toString());
```

## Documentation

See <http://direqt-sdk-js.readthedocs.org/en/latest/> for documentation on using Direqt with JavaScript. 



Copyright (c) 2017 Direqt Inc. All Rights Reserved.

